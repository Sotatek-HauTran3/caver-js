/*
    Copyright 2020 The caver-js Authors
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

const _ = require('lodash')
const AbstractKeyring = require('./abstractKeyring')

const utils = require('../../../caver-utils')
const PrivateKey = require('./privateKey')
const { KEY_ROLE } = require('./keyringHelper')
const Account = require('../../../caver-account')
const { fillWeightedMultiSigOptionsForMultiSig } = require('../../../caver-account/src/accountKey/accountKeyHelper')
const { validateForSigning, validateIndexWithKeys, encryptKey, formatEncrypted } = require('./keyringHelper')

/**
 * representing a Keyring which includes `address` and `private keys`.
 * @class
 */
class MultipleKeyring extends AbstractKeyring {
    /**
     * creates a keyring.
     * @param {string} address - The address of keyring.
     * @param {Array.<string>|Array.<PrivateKey>} keys - The keys to use in MultipleKeyring.
     */
    constructor(address, keys) {
        super(address)
        this.keys = keys
    }

    /**
     * @type {Array.<PrivateKey>}
     */
    get keys() {
        return this._keys
    }

    set keys(keyInput) {
        if (keyInput === null) {
            this._key = null
            return
        }
        this._keys = formattingForKeyInKeyring(keyInput)
    }

    /**
     * returns public key strings.
     *
     * @return {Array.<string>}
     */
    getPublicKey() {
        const publicKeys = []
        for (let i = 0; i < this.keys.length; i++) {
            publicKeys.push(this.keys[i].getPublicKey())
        }
        return publicKeys
    }

    /**
     * returns a copied multipleKeyring instance
     *
     * @return {MultipleKeyring}
     */
    copy() {
        return new MultipleKeyring(this.address, this.keys)
    }

    /**
     * signs with transactionHash with key and returns signature.
     *
     * @param {string} transactionHash The hash of transaction.
     * @param {string|number} chainId The chainId specific to the network.
     * @param {number} role A number indicating the role of the key. You can use `caver.wallet.keyring.role`.
     * @param {number} [index] The index of the key to be used. (default: 0)
     * @return {Array<string>}
     */
    signWithKey(transactionHash, chainId, role, index = 0) {
        validateForSigning(transactionHash, chainId)
        if (role === undefined) throw new Error(`role should be defined to sign.`)

        const keys = this.getKeyByRole(role)
        validateIndexWithKeys(index, keys.length)
        return keys[index].sign(transactionHash, chainId)
    }

    /**
     * signs with transactionHash with multiple keys and returns signatures.
     *
     * @param {string} transactionHash The hash of transaction.
     * @param {string|number} chainId the chain id specific to the network
     * @param {number} role A number indicating the role of the key. You can use `caver.wallet.keyring.role`.
     * @return {Array.<Array<string>>}
     */
    signWithKeys(transactionHash, chainId, role) {
        validateForSigning(transactionHash, chainId)
        if (role === undefined) throw new Error(`role should be defined to sign.`)

        const signatures = []

        for (const key of this.getKeyByRole(role)) {
            signatures.push(key.sign(transactionHash, chainId))
        }

        return signatures
    }

    /**
     * signs with hashed message and returns result object that includes `signature`, `message` and `messageHash`
     *
     * @param {string} message The message string to sign.
     * @param {number} [role] A number indicating the role of the key. You can use `caver.wallet.keyring.role`. (default: `caver.wallet.keyring.role.roleTransactionKey`)
     * @param {number} [index] The index of the key to be used. (default: 0)
     * @return {object}
     */
    signMessage(message, role, index) {
        const messageHash = utils.hashMessage(message)
        if (role === undefined && index === undefined) {
            role = KEY_ROLE.roleTransactionKey
            if (this._keys.length === 0) throw new Error(`Default key(${KEY_ROLE[0]}) does not have enough keys to sign.`)
            index = 0
        } else if (role === undefined || index === undefined) {
            throw new Error(
                `To sign the given message, both role and index must be defined. ` +
                    `If both role and index are not defined, this function signs the message using the default key(${KEY_ROLE[0]}[0]).`
            )
        }

        const keys = this.getKeyByRole(role)
        validateIndexWithKeys(index, keys.length)

        const signature = keys[index].signMessage(messageHash)
        return {
            messageHash,
            signature,
            message,
        }
    }

    /**
     * returns keys by role.If the key of the role passed as parameter is empty, the default key is returned.
     *
     * @param {number} role A number indicating the role of the key. You can use `caver.wallet.keyring.role`.
     * @return {Array.<PrivateKey>}
     */
    getKeyByRole(role) {
        if (role === undefined) throw new Error(`role should be defined.`)
        if (role >= KEY_ROLE.roleLast) throw new Error(`Invalid role number: ${role}`)
        return this.keys
    }

    /**
     * returns an instance of Account.
     *
     * @param {WeightedMultiSigOptions} [options] The options that includes 'threshold' and 'weight'. This is only necessary when keyring use multiple private keys.
     * @return {Account}
     */
    toAccount(options) {
        if (_.isArray(options))
            throw new Error(`For AccountKeyWeightedMultiSig, options cannot be defined as an array of WeightedMultiSigOptions.`)

        options = fillWeightedMultiSigOptionsForMultiSig(this.keys.length, options)

        const publicKeys = this.getPublicKey()
        return Account.createWithAccountKeyWeightedMultiSig(this.address, publicKeys, options)
    }

    /**
     * encrypts a keyring and returns a keystore v4 object.
     *
     * @param {string} password The password to be used for encryption. The encrypted key store can be decrypted with this password.
     * @param {object} options The options to use when encrypt a keyring. Also address can be defined specifically in options object.
     * @return {object}
     */
    /**
     * options can include below
     * {
     *   salt: ...,
     *   iv: ...,
     *   kdf: ...,
     *   dklen: ...,
     *   c: ...,
     *   n: ...,
     *   r: ...,
     *   p: ...,
     *   cipher: ...,
     *   uuid: ...,
     *   cipher: ...,
     * }
     */
    encrypt(password, options = {}) {
        let keyring = []
        keyring = encryptKey(this.keys, password, options)
        return formatEncrypted(4, this.address, keyring, options)
    }
}

module.exports = MultipleKeyring

/**
 * Format the key parameters passed by the user to create a keyring instance.
 * @param {Array.<string|PrivateKey>} keyInput The input parameter for key variable in Keyring.
 * @return {Array.<PrivateKey>}
 */
function formattingForKeyInKeyring(keyInput) {
    if (!_.isArray(keyInput)) {
        throw new Error(`Invalid parameter. The private keys to add should be defined as an array.`)
    }

    const keys = []
    for (let i = 0; i < keyInput.length; i++) {
        keys.push(keyInput[i] instanceof PrivateKey ? keyInput[i] : new PrivateKey(keyInput[i]))
    }

    return keys
}
