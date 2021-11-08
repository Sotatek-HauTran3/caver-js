/*
    Copyright 2021 The caver-js Authors
    This file is part of the caver-js library.

    The caver-js library is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    The caver-js library is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with the caver-js. If not, see <http://www.gnu.org/licenses/>.
*/

import { AccountKey } from '../../caver-account/src'
import {
    Block,
    BlockNumber,
    TransactionReceipt,
    BlockWithConsensusInfo,
    TransactionForRPC,
    PromiEvent,
    TransactionForSendRPC,
    RLPEncodedTransaction,
    DecodedAnchoringTransaction,
    Log,
    LogsOptions,
    LogObject,
    CallObject,
} from '../../caver-core/src'
import { Transaction } from '../../caver-transaction/src'
import RpcCallToMethod from '../../caver-rtm/src'

export interface AccountForRPC {
    accType: number
    account: {
        nonce: number
        balance: string
        humanReadable: boolean
        key: AccountKeyForRPC
    }
}

export interface AccountKeyForRPC {
    keyType: number
    nonce?: number
    key?: AccountKeyForRPC | AccountKeyForRPC[]
}

export interface Syncing {
    startingBlock: number
    currentBlock: number
    highestBlock: number
    knownStates: number
    pulledStates: number
}

export interface KlaytnCall {
    getAccountKey: Klay['getAccountKey']
    getChainId: Klay['getChainId']
    getGasPrice: Klay['getGasPrice']
    getTransactionByHash: Klay['getTransactionByHash']
    getTransactionCount: Klay['getTransactionCount']
}

export default class Klay {
    constructor(...args: any[])

    accountCreated(address: string, blockNumber?: BlockNumber, callback?: (error: Error, result: boolean) => void): Promise<boolean>
    getAccounts(callback?: (error: Error, result: string[]) => void): Promise<string[]>
    encodeAccountKey(accountKey: AccountKeyForRPC | AccountKey, callback?: (error: Error, result: string) => void): Promise<string>
    decodeAccountKey(encodedAccountKey: string, callback?: (error: Error, result: AccountKeyForRPC) => void): Promise<AccountKeyForRPC>
    getAccount(address: string, blockNumber?: BlockNumber, callback?: (error: Error, result: AccountForRPC) => void): Promise<AccountForRPC>
    getAccountKey(
        address: string,
        blockNumber?: BlockNumber,
        callback?: (error: Error, result: AccountKeyForRPC) => void
    ): Promise<AccountKeyForRPC>
    getBalance(address: string, blockNumber?: BlockNumber, callback?: (error: Error, result: string) => void): Promise<string>
    getCode(address: string, blockNumber?: BlockNumber, callback?: (error: Error, result: string) => void): Promise<string>
    getTransactionCount(address: string, blockNumber?: BlockNumber, callback?: (error: Error, result: string) => void): Promise<string>
    isContractAccount(address: string, blockNumber?: BlockNumber, callback?: (error: Error, result: boolean) => void): Promise<boolean>
    sign(address: string, message: string, blockNumber?: BlockNumber, callback?: (error: Error, result: string) => void): Promise<string>

    getBlockNumber(callback?: (error: Error, result: string) => void): Promise<string>
    getBlock(blockNumber: BlockNumber, returnTransactionObjects?: boolean, callback?: (error: Error, result: Block) => void): Promise<Block>
    getBlockByNumber(
        blockNumber: number,
        returnTransactionObjects?: boolean,
        callback?: (error: Error, result: Block) => void
    ): Promise<Block>
    getBlockByHash(blockHash: string, returnTransactionObjects?: boolean, callback?: (error: Error, result: Block) => void): Promise<Block>
    getBlockReceipts(blockHash: string, callback?: (error: Error, result: TransactionReceipt[]) => void): Promise<TransactionReceipt[]>
    getBlockTransactionCount(blockNumber: BlockNumber, callback?: (error: Error, result: string) => void): Promise<string>
    getBlockTransactionCountByNumber(blockNumber: number, callback?: (error: Error, result: string) => void): Promise<string>
    getBlockTransactionCountByHash(blockHash: string, callback?: (error: Error, result: string) => void): Promise<string>
    getBlockWithConsensusInfo(
        blockNumber: BlockNumber,
        callback?: (error: Error, result: BlockWithConsensusInfo) => void
    ): Promise<BlockWithConsensusInfo>
    getBlockWithConsensusInfoByNumber(
        blockNumber: number,
        callback?: (error: Error, result: BlockWithConsensusInfo) => void
    ): Promise<BlockWithConsensusInfo>
    getBlockWithConsensusInfoByHash(
        blockHash: string,
        callback?: (error: Error, result: BlockWithConsensusInfo) => void
    ): Promise<BlockWithConsensusInfo>
    getCommittee(blockNumber: BlockNumber, callback?: (error: Error, result: string[]) => void): Promise<string[]>
    getCommitteeSize(blockNumber: BlockNumber, callback?: (error: Error, result: number) => void): Promise<number>
    getCouncil(blockNumber: BlockNumber, callback?: (error: Error, result: string[]) => void): Promise<string[]>
    getCouncilSize(blockNumber: BlockNumber, callback?: (error: Error, result: number) => void): Promise<number>

    getStorageAt(
        address: string,
        position: number,
        blockNumber?: BlockNumber,
        callback?: (error: Error, result: string) => void
    ): Promise<string>
    isMining(callback?: (error: Error, result: boolean) => void): Promise<boolean>
    isSyncing(callback?: (error: Error, result: Syncing | boolean) => void): Promise<Syncing | boolean>

    call(callObject: CallObject, blockNumber?: BlockNumber, callback?: (error: Error, result: string) => void): Promise<string>
    estimateGas(callObject: CallObject, blockNumber?: BlockNumber, callback?: (error: Error, result: string) => void): Promise<string>
    estimateComputationCost(
        callObject: CallObject,
        blockNumber?: BlockNumber,
        callback?: (error: Error, result: string) => void
    ): Promise<string>

    getTransactionFromBlock(
        blockNumber: BlockNumber,
        index: number,
        callback?: (error: Error, result: TransactionForRPC) => void
    ): Promise<TransactionForRPC>
    getTransactionByBlockNumberAndIndex(
        blockNumber: number,
        index: number,
        callback?: (error: Error, result: TransactionForRPC) => void
    ): Promise<TransactionForRPC>
    getTransactionByBlockHashAndIndex(
        blockHash: string,
        index: number,
        callback?: (error: Error, result: TransactionForRPC) => void
    ): Promise<TransactionForRPC>
    getTransaction(
        transactionHash: string,
        callback?: (error: Error, result: TransactionForRPC | null) => void
    ): Promise<TransactionForRPC | null>
    getTransactionByHash(
        transactionHash: string,
        callback?: (error: Error, result: TransactionForRPC | null) => void
    ): Promise<TransactionForRPC | null>
    getTransactionBySenderTxHash(
        senderTxHash: string,
        callback?: (error: Error, result: TransactionForRPC | null) => void
    ): Promise<TransactionForRPC | null>
    getTransactionReceipt(
        transactionHash: string,
        callback?: (error: Error, result: TransactionReceipt | null) => void
    ): Promise<TransactionReceipt | null>
    getTransactionReceiptBySenderTxHash(
        senderTxHash: string,
        callback?: (error: Error, result: TransactionReceipt | null) => void
    ): Promise<TransactionReceipt | null>

    submitTransaction(
        signedTransaction: string | Transaction,
        callback?: (error: Error, result: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt>
    sendRawTransaction(
        signedTransaction: string | Transaction,
        callback?: (error: Error, result: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt>
    sendTransaction(
        transaction: TransactionForSendRPC | Transaction,
        callback?: (error: Error, result: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt>
    sendTransactionAsFeePayer(
        transaction: TransactionForSendRPC | Transaction,
        callback?: (error: Error, result: TransactionReceipt) => void
    ): PromiEvent<TransactionReceipt>
    signTransaction(
        transaction: TransactionForSendRPC | Transaction,
        callback?: (error: Error, result: RLPEncodedTransaction) => void
    ): Promise<RLPEncodedTransaction>
    signTransactionAsFeePayer(
        transaction: TransactionForSendRPC | Transaction,
        callback?: (error: Error, result: RLPEncodedTransaction) => void
    ): Promise<RLPEncodedTransaction>
    getDecodedAnchoringTransactionByHash(
        transactionHash: string,
        callback?: (error: Error, result: DecodedAnchoringTransaction) => void
    ): Promise<DecodedAnchoringTransaction>

    getChainId(callback?: (error: Error, result: string) => void): Promise<string>
    getClientVersion(callback?: (error: Error, result: string) => void): Promise<string>
    getGasPrice(callback?: (error: Error, result: string) => void): Promise<string>
    getGasPriceAt(blockNumber?: number, callback?: (error: Error, result: string) => void): Promise<string>
    isParallelDBWrite(callback?: (error: Error, result: boolean) => void): Promise<boolean>
    isSenderTxHashIndexingEnabled(callback?: (error: Error, result: boolean) => void): Promise<boolean>
    getProtocolVersion(callback?: (error: Error, result: string) => void): Promise<string>
    getRewardbase(callback?: (error: Error, result: string) => void): Promise<string>

    getFilterChanges(filterId: string, callback?: (error: Error, result: LogObject[]) => void): Promise<LogObject[]>
    getFilterLogs(filterId: string, callback?: (error: Error, result: LogObject[]) => void): Promise<LogObject[]>
    getLogs(options: LogsOptions, callback?: (error: Error, result: Log[]) => void): Promise<Log[]>
    newBlockFilter(callback?: (error: Error, result: string) => void): Promise<string>
    newFilter(options: LogsOptions, callback?: (error: Error, result: string) => void): Promise<string>
    newPendingTransactionFilter(callback?: (error: Error, result: string) => void): Promise<string>
    uninstallFilter(filterId: string, callback?: (error: Error, result: boolean) => void): Promise<boolean>
    sha3(data: string, callback?: (error: Error, result: string) => void): Promise<string>
}
