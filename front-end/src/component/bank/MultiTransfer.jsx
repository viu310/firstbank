import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/bank.module.css'
import ts from './css/transfer.module.css'
import Table from 'react-bootstrap/Table';
import BankApiService from '../../BankApiService';

//잔액에 ,더하기
function addComma(money) {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function MultiTransfer() {

    const navigate  = useNavigate();
    // 초기계좌값
    const [account_id, setAccount_id] = useState("777545-21-879512");
    
    useEffect(() => {
        if( window.sessionStorage.getItem('customerNum') == null || 0){
            navigate("/login");
        }

    }, []);


    //뿌려주는 정보 배열
    const [transfers, setTransfers] = useState([
        { transfer_account: '', transfer_money: '', transfer_outcoment: '', transfer_incoment: '', transfer_name: '' },
        { transfer_account: '', transfer_money: '', transfer_outcoment: '', transfer_incoment: '', transfer_name: '' },
        { transfer_account: '', transfer_money: '', transfer_outcoment: '', transfer_incoment: '', transfer_name: '' },
        { transfer_account: '', transfer_money: '', transfer_outcoment: '', transfer_incoment: '', transfer_name: '' },
        { transfer_account: '', transfer_money: '', transfer_outcoment: '', transfer_incoment: '', transfer_name: '' },
        { transfer_account: '', transfer_money: '', transfer_outcoment: '', transfer_incoment: '', transfer_name: '' },
        { transfer_account: '', transfer_money: '', transfer_outcoment: '', transfer_incoment: '', transfer_name: '' },
        { transfer_account: '', transfer_money: '', transfer_outcoment: '', transfer_incoment: '', transfer_name: '' },
        { transfer_account: '', transfer_money: '', transfer_outcoment: '', transfer_incoment: '', transfer_name: '' },
        { transfer_account: '', transfer_money: '', transfer_outcoment: '', transfer_incoment: '', transfer_name: '' }
    ]);

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const list = [...transfers];    // transfers 배열복제
        list[index][name] = value;
        setTransfers(list);
    };
    

    //배열에 맞는 취소버튼
    const reset = (index) => {
        setTransfers(prevTransfers => {
            const updatedTransfers = [...prevTransfers];
            updatedTransfers[index] = {
                transfer_account: '',
                transfer_money: '',
                transfer_outcoment: '',
                transfer_incoment: '',
                transfer_name: ''
            };
            return updatedTransfers;
        });
    }

    const transferSubmit = (e) => {

        e.preventDefault();
        

        const isValid = transfers.some(transfer => (
            transfer.transfer_account !== '' &&
            transfer.transfer_money !== '' &&
            transfer.transfer_name !== ''
        ));
            
        if (isValid) {
            Promise.all(transfers.map(transfer => (
                // 입력된 값이 있는 경우에만 서버에 전송
                transfer.transfer_account !== '' && transfer.transfer_money !== '' && transfer.transfer_name !== ''
                    ? BankApiService.saveMulti({...transfer, account_id })
                    : Promise.resolve(null)
            )))
                .then(responses => {
                    console.log('이체 성공: ', responses);
                    navigate('/bank/multi');
                })
                .catch(err => {
                    console.log('saveMulti() 에러!!', err);
                });
        }
    }
    return (
        <div className={styles.bankStyle}>
            <div className={styles.bankRoot}>
                <div>
                    <a href="/bank/record">뱅킹관리</a>
                    {' '}
                    {'>'}
                    {' '}
                    <a href="/bank/transfer">이체하기</a>{' '}
                    {'>'}
                    {' '}
                    <a href="/bank/multi">다계좌이체</a>
                </div>
            </div>
            <div className={styles.top_tit}>다계좌이체</div>
            <div className={ts.ts_info}>
                <div>다계좌이체 주의안내</div>
                <div> - 거래후 반드시 이제내역조회 및 출금계좌거래내역을 확인하시기 바랍니다.</div>
                <div> - 모든 입금정보에 대해 출금계좌는 동일하게 지정됩니다.</div>
                <div style={{color:'crimson'}}> - 필수 입금정보(이체계좌번호, 이체금액, 받는분 예금주명) 누락시 이체되지 않습니다.</div>
            </div>
            <div className={ts.ts_tbl}>
                <Table>
                    <thead>
                        <tr >
                            <th colSpan={4}>출금계좌 설정</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className={ts.tr_width}>
                            <td>출금계좌번호</td>
                            <td>
                                <select
                                    required
                                    label="account_id"
                                    name="account_id"
                                    value={account_id}
                                    onChange={(e) => {
                                        setAccount_id(e.target.value);
                                    }}
                                >
                                    <option value="777545-21-879512" selected>777545-21-879512</option>
                                    <option value="222878-21-879512">777545-21-879512</option>
                                </select>
                            </td>
                            <td className={ts.ts_grey}>출금가능금액</td>
                            <td>
                                {addComma(5045489)}원
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>

            <div className={ts.ts_tbl}>
                <Table>
                    <thead>
                        <tr>
                            <th colSpan={6}>입금계좌 설정</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className={ts.td_title}>
                            <td>입금계좌번호</td>
                            <td>이체금액</td>
                            <td>입금통장<br />표시내용(선택)</td>
                            <td>출금통장<br />표시내용(선택)</td>
                            <td>받는분 예금주명</td>
                            <td>취소</td>
                        </tr>
                        {transfers.map((transfer, index) => (
                            <tr className={ts.td_content} key={index}>
                                <td>
                                    <input type="text"
                                        required
                                        placeholder='-제외 계좌번호 숫자'
                                        className={ts.transfer_account}
                                        label="transfer_account"
                                        name="transfer_account"
                                        minLength="14"
                                        maxlength="14"
                                        value={transfer.transfer_account}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (!isNaN(value)) {
                                                handleInputChange(index, e);
                                            } else if (value === '') {
                                                setTransfers(prevTransfers => {
                                                    const updatedTransfers = [prevTransfers];
                                                    updatedTransfers[index].transfer_account = '';
                                                    return updatedTransfers;
                                                });
                                            }
                                        }}
                                    />
                                </td>
                                <td>
                                    <div className={ts.money_box}>
                                        <input type="text"
                                            required
                                            placeholder='숫자 입력'
                                            label="transfer_money"
                                            name="transfer_money"
                                            value={transfer.transfer_money}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (!isNaN(value)) {
                                                    handleInputChange(index, e);
                                                } else if (value === '') {
                                                    setTransfers(prevTransfers => {
                                                        const updatedTransfers = [prevTransfers];
                                                        updatedTransfers[index].transfer_money = '';
                                                        return updatedTransfers;
                                                    });
                                                }
                                            }}
                                        />
                                        <span>&nbsp;원</span></div>
                                </td>
                                <td>
                                    <input type="text"
                                        required
                                        placeholder='통장에는 14자표시'
                                        className={ts.transfer_incoment}
                                        label="transfer_incoment"
                                        name="transfer_incoment"
                                        maxlength="20"
                                        value={transfer.transfer_incoment}
                                        onChange={(e) => {
                                            handleInputChange(index, e);
                                        }}
                                    />
                                </td>
                                <td>
                                    <input type="text"
                                        required
                                        placeholder='통장에는 14자표시'
                                        className={ts.transfer_outcoment}
                                        label="transfer_outcoment"
                                        name="transfer_outcoment"
                                        maxlength="20"
                                        value={transfer.transfer_outcoment}
                                        onChange={(e) => {
                                            handleInputChange(index, e);
                                        }}
                                    />
                                </td>
                                <td>
                                    <input type="text"
                                        required
                                        placeholder='예금주명'
                                        className={ts.transfer_name}
                                        label="transfer_name"
                                        name="transfer_name"
                                        maxlength="10"
                                        value={transfer.transfer_name}
                                        onChange={(e) => {
                                            handleInputChange(index, e);
                                        }}
                                    />
                                </td>
                                <td className={ts.transfer_reset}>
                                    <button type="reset" onClick={() => reset(index)}>취소</button>
                                </td>
                            </tr>
                        ))}


                        <tr>
                            <td colSpan={6} className={ts.transfer_btnbox}>
                                <button value="contained" onClick={transferSubmit}>이체</button>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>

        </div>
    )


}

//alert("INSERT INTO transfer (transfer_number, account_id, transfer_account, transfer_money, transfer_name) VALUES ((SELECT NVL(MAX(transfer_number), 0) + 1 FROM transfer), '77712121485612',transfer_account=#{transfer_account},transfer_money= #{transfer_money}, transfer_name=#{transfer_name})");