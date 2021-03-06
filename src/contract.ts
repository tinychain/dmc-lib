import { Address } from "./address";
import { getSelf, getSender, getReceiver } from "../internal/account.d";
import { Action } from "./action";
import { returnData, returnU64 } from "../internal/action.d";
import { StringToUsize } from "../lib/codec";
import { Builtin } from "dmc-lib";

export class Contract {
    sender: Address;
    receiver: Address;
    contract: Address;
    actionName: string;

    get self(): Address {
        return this.receiver;
    }

    constructor() {
        let _contract = new Bytes(20);
        getSelf(changetype<usize>(_contract.buffer));
        this.contract = Address.fromBytes(_contract);
        let _sender = new Bytes(20);
        getSender(changetype<usize>(_sender.buffer));
        this.sender = Address.fromBytes(_sender);
        let _receiver = new Bytes(20);
        getReceiver(changetype<usize>(_receiver.buffer));
        this.receiver = Address.fromBytes(_receiver);
        this.actionName = Action.getActionName();
    }

    isAction(actionName: string): bool {
        return actionName == this.actionName;
    }

    getDataStream(): DataStream {
        return Action.getActionData();
    }

    // static get txHash() {
    //     return Transaction.getTxHash();
    // }

    ReturnBytes(bytes: Bytes): void {
        returnData(changetype<usize>(bytes.buffer), bytes.length);
    }

    /**
     * Set string as return data of action.
     * 
     * @param str - a string
     */
    ReturnString(str: string): void {
        const ds = Builtin.fromString(str)
        returnData(changetype<usize>(ds.datastream.buffer), ds.bytesLen);
    }

    /**
     * Set uint64 value as return data of action.
     * 
     * @param v - u64 value
     */
    ReturnU64(v: u64): void {
        returnU64(v);
    }


}