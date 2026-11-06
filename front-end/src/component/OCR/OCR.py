import pymysql
import re
from google.cloud import vision_v1
import io
import os

# 인증키 환경 변수 저장
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/home/ubuntu/server/util/visionapi-417708-135003c89fe7.json"

# 현재 스크립트 파일의 디렉토리 경로 가져오기
path = "/home/ubuntu/server/firstbank/front-end/src/component/OCR/idcard/"

# DB 연결
conn = pymysql.connect(host="13.124.80.180", user="bank", password="1234", db="firstbank", charset="utf8")

cur = conn.cursor()

idcard_name = ""
idcard_number = ""

client = vision_v1.ImageAnnotatorClient()
print(path)

# 폴더 내의 모든 파일 목록 가져오기
file_list = os.listdir(path)
print(file_list)

# 파일 목록 출력
print("folder:")
for file_name in file_list:
    print(file_name)


    with io.open(path + file_name, 'rb') as image_file:
        content = image_file.read()

    image = vision_v1.Image(content=content)

    price_candidate = []
    card_number_candidate = []
    date_candidate = []

    response = client.text_detection(image=image)
    texts = response.text_annotations
    print('Texts:')

    # 잘 추출했으면 실행
    for text in texts:
        content = text.description
        content = content.replace(',','')

    # 에러났으면 실행
    if response.error.message:
        raise Exception(
            '{}\nFor more info on error messages, check: '
            'https://cloud.google.com/apis/design/errors'.format(
                response.error.message))

    # 주민등록번호 추출
    id_number_pattern = r"\d{6}-?\d{7}"


    # 이름 추출
    name_pattern = r"\b[가-힣]{3}\b"


    # 추출 결과
    text_results = [text.description for text in texts]

    # 텍스트 결과를 합치기
    text_combined = " ".join(text_results)

    # 주민등록번호 추출
    idcard_number_match = re.search(id_number_pattern, text_combined)
    if idcard_number_match:
        idcard_number = idcard_number_match.group()
    else:
        idcard_number = None

    # 이름 추출
    name_match = re.search(name_pattern, text_combined)
    if name_match:
        idcard_name = name_match.group()
    else:
        idcard_name = None


    print("이름:", idcard_name)
    print("주민등록번호:", idcard_number)

    cur.execute("INSERT INTO idcard (idcard_name, idcard_number) VALUES (%s, %s)", (idcard_name, idcard_number))

    # 이건 insert 아니면 굳이 할 필요 없음
    conn.commit()

cur.close()
conn.close()