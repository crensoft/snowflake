import { promisify } from "util";
// @ts-ignore
import macaddress from "macaddress";
const macAddrAsync = promisify(macaddress.one);

class FlakeId {
  _sequenceId = BigInt(0);
  // @ts-ignore
  _nodeId: bigint;

  TOTAL_BITS = BigInt(64);
  EPOCH_BITS = BigInt(42); // 41 orignal
  NODE_BITS = BigInt(10); // 14 orignal
  SEQUENCE_BITS = BigInt(12); // 8 original

  EPOCH: number; // Sunday, October 27, 2019

  MAX_SEQUENCE: BigInt;

  constructor(epoch: string | number) {
    if (!epoch) {
      throw new Error("Expected valid EPOCH");
    }

    this.EPOCH = Number(epoch);
    this.MAX_SEQUENCE = BigInt(Math.pow(2, Number(this.SEQUENCE_BITS)) - 1);
  }

  async setup() {
    const mac = (await macAddrAsync()) as string;
    this._nodeId = BigInt(
      parseInt(mac.split(":").join(""), 16) %
        (Math.pow(2, Number(this.NODE_BITS)) - 1)
    );
  }

  now() {
    return Date.now();
  }

  async create() {
    const currentTimestamp = BigInt(Date.now() - this.EPOCH);

    // fills first EPOCH_BITS bits of TOTAL_BITS int
    let id = currentTimestamp << (this.TOTAL_BITS - this.EPOCH_BITS);

    if (!this._nodeId) {
      throw new Error("nodeId not ready");
    }

    id |= this._nodeId << (this.TOTAL_BITS - this.EPOCH_BITS - this.NODE_BITS);

    // @ts-ignore
    this._sequenceId += BigInt(1);

    // @ts-ignore
    id |= this._sequenceId % this.MAX_SEQUENCE;

    return id.toString(10);
  }
}

// make somes ids
export default new FlakeId(process.env.EPOCH as string);
