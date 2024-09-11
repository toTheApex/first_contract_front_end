import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract } from "ton-core";
import { toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
  const client = useTonClient();
  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();
  
  const { sender } = useTonConnect();
    
  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
    

  const [balance, setBalance] = useState<null | number>(0);

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MainContract(
      Address.parse("EQCnX5WFgrfw0kjCvmxrUoGFmrr9I1z36BqJcM1gPxfo0S3K") // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData();
      const { balance } = await mainContract.getBalance();
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });
      setBalance(balance);
      await sleep(10000); // sleep 10 seconds and poll value again
      getValue();
    }
    getValue();
  }, [mainContract]);

//   return {
//     contract_address: mainContract?.address.toString(),
//     contract_balance: balance,
//     ...contractData,
//   };
    return {
        counter_value: contractData?.counter_value,
        owner_address: contractData?.owner_address.toString(),
        balance: balance,
        contract_address: mainContract?.address.toString(),
        sendIncrement: () => {
        return mainContract?.sendIncrement(sender, toNano(0.001), 2);
        },
        sendDeposit: () => {
        return mainContract?.sendDeposit(sender, toNano(0.01));
        },
        sendWithdrawalRequest: () => {
        return mainContract?.sendWithdrawalRequest(sender, toNano(0.01), toNano(0.02));
        }
    };
}