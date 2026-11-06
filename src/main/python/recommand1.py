# -*- coding: utf-8 -*-
"""
Created on Sat Mar 23 16:02:38 2024

@author: ICT01-09
"""
import pandas as pd # raw dataset
from surprise import SVD, accuracy # SVD model, 평가
from surprise import Reader, Dataset # SVD model의 dataset



import pymysql

conn = pymysql.connect(host="13.124.80.180", user="bank", password="1234", db="firstbank", charset="utf8")

cur = conn.cursor()
cur.execute("delete from recommand;");
conn.commit();

cur.execute("select sg.saving_grade_id, c.customer_name, s.saving_name, sg.saving_grade, s.saving_id  from saving_grade sg inner join account a on a.account_id = sg.account_id inner join customer c on a.customer_num = c.customer_num inner join saving s on s.saving_id = sg.saving_id order by customer_name;");





print('기본ID    사용자이름    적금상품이름    평점')
print('---------------------------------------------')

sd = pd.DataFrame(columns=['c_name','s_name','grade'])



i = 0
while (True):
    row = cur.fetchone()
    if row==None:
        break
    data1 = row[0]
    data2 = row[1]
    data3 = row[2]
    data4 = row[3]
    sd.loc[i] = [data2,data3,data4]
    i=i+1

    print(( data2, data3, data4))
    



#rating = pd.read_csv(r"./movie_rating.csv")
#rating.head()   #   critic(user)   title(item)   rating


#rating['critic'].value_counts()
#rating['title'].value_counts()

sd['c_name'].value_counts()
sd['s_name'].value_counts()

# 관람 vs 미관람
#tab = pd.crosstab(rating['critic'], rating['title'])
tab = pd.crosstab(sd['c_name'], sd['s_name'])
#tab



# movie rating
# 두 개의 집단변수를 가지고 나머지 rating을 그룹화
#rating_g = rating.groupby(['critic', 'title'])
#rating_g.sum()
sd_g = sd.groupby(['c_name', 's_name'])
sd_g.sum()
tab = sd_g.sum().unstack() # 행렬구조로 변환



# 2. rating 데이터셋 생성
reader = Reader(rating_scale= (1, 5)) # 평점 범위
data = Dataset.load_from_df(df=sd, reader=reader)
# rating이라는 데이터프레임은 reader(1~5)의 평점 범위를 가진다.



# 3. train/test set
train = data.build_full_trainset() # 훈련셋
test = train.build_testset() # 검정셋


# 4. model 생성
#help(SVD)

model = SVD(n_factors=100, n_epochs=20, random_state=123)
model.fit(train) # model 생성



cur = conn.cursor()
cur.execute("select  c.customer_name from account a inner join customer c on a.customer_num = c.customer_num  where a.account_type ='s' group by customer_name ;");


#conn.commit();


user =[]

i = 0
while (True):
    row = cur.fetchone()
    if row==None:
        break
    data1 = row[0]
    user.append(data1)
    i=i+1

    #print((data1, data2, data3, data4))
    

#print(user)

# 5. Toby 사용자 영화추천
user_id = '머신테스트5' # 추천대상자
item_ids = ['자동적금', '청년적금', '자유적금'] # 추천 대상 영화
actual_rating = 0 # 실제 평점

 
item_ids=[]
for i in range(len(user)):
    print(user[i])


    user_id = user[i]
    temp=''
    recommandSaving =''
    
    cur = conn.cursor()
    que1 = "select saving_name from saving s where s.saving_id not in (select a.account_pd_id from account a inner join customer c on a.customer_num = c.customer_num where a.account_type='s' and c.customer_name ='"
    que2 = "');"
    cur.execute(que1+str(user[i])+que2);

    j = 0
    while (True):
        row = cur.fetchone()
        if row==None:
            
            break
        data1 = row[0]
        item_ids.append(data1)
        j=j+1
    
    cur = conn.cursor()
    que = "insert into recommand(customer_name,saving_name,recommand_rating) values"
    for item_id in item_ids :
        #print("item_id : "+item_id)
        print(model.predict(user_id, item_id, actual_rating))
        customer = user_id
        saving = item_id
        est = model.predict(user_id, item_id, actual_rating).est
        que2 = "),"
        que += "('"+str(customer) + "','" + str(saving) + "'," + str(est) + str(que2) 
        
    
    que = que[:-1]
    que +=";"
    print(que)
    cur.execute(que);    
    conn.commit()

    item_ids=[]

conn.close()
    
    
    