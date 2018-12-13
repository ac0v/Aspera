import {Injectable} from '@angular/core';
import {Block, GetBlockchainStatusResponse, HttpError, Settings} from '../model';
import {HttpClient, HttpEvent, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {I18nService} from '../i18n/i18n.service';
import {BurstUtil} from '../util';
import {StoreService} from "./store.service";

@Injectable()
export class BurstService {
    private nodeUrl: string;

    constructor(private httpService: HttpClient,
                private i18nService: I18nService,
                private storeService: StoreService) {

        this.storeService.settings.subscribe((settings: Settings) => {
            this.nodeUrl = settings.node;
        });
    }

    public getBlockchainStatus(): Observable<HttpEvent<GetBlockchainStatusResponse | HttpError>> {

        let params: HttpParams = new HttpParams().set("requestType", "getBlockchainStatus");
        let requestOptions = BurstUtil.getRequestOptions();
        requestOptions.params = params;

        return this.httpService.get<GetBlockchainStatusResponse | HttpError>(this.nodeUrl, requestOptions);
    }

    public getBlock(blockNumber?: string): Observable<HttpEvent<Block | HttpError>> {

        let params: HttpParams = new HttpParams()
            .set("requestType", "getBlock");

        if (blockNumber) {
            params.set("blockNumber", blockNumber);
        }

        let requestOptions = BurstUtil.getRequestOptions();
        requestOptions.params = params;

       return this.httpService.get<Block | HttpError>(this.nodeUrl, requestOptions);
    }

    public translateServerError(response) {
        let match = [];
        if (!response.errorDescription) {
            if (response.errorMessage) {
                response.errorDescription = response.errorMessage;
            } else if (response.error) {
                if (typeof response.error === "string") {
                    response.errorDescription = response.error;
                    response.errorCode = -1;
                } else {
                    return this.i18nService.getTranslation("error_unknown");
                }
            } else {
                return this.i18nService.getTranslation("error_unknown");
            }
        }

        switch (response.errorCode) {
            case -1:
                switch (response.errorDescription) {
                    case "Invalid ordinary payment":
                        return this.i18nService.getTranslation("error_invalid_ordinary_payment");
                    case "Missing alias name":
                        return this.i18nService.getTranslation("error_missing_alias_name");
                    case "Transferring aliases to Genesis account not allowed":
                        return this.i18nService.getTranslation("error_alias_transfer_genesis");
                    case "Ask order already filled":
                        return this.i18nService.getTranslation("error_ask_order_filled");
                    case "Bid order already filled":
                        return this.i18nService.getTranslation("error_bid_order_filled");
                    case "Only text encrypted messages allowed":
                        return this.i18nService.getTranslation("error_encrypted_text_messages_only");
                    case "Missing feedback message":
                        return this.i18nService.getTranslation("error_missing_feedback_message");
                    case "Only text public messages allowed":
                        return this.i18nService.getTranslation("error_public_text_messages_only");
                    case "Purchase does not exist yet or not yet delivered":
                        return this.i18nService.getTranslation("error_purchase_delivery");
                    case "Purchase does not exist or is not delivered or is already refunded":
                        return this.i18nService.getTranslation("error_purchase_refund");
                    case "Recipient account does not have a public key, must attach a public key announcement":
                        return this.i18nService.getTranslation("error_recipient_no_public_key_announcement");
                    case "Transaction is not signed yet":
                        return this.i18nService.getTranslation("error_transaction_not_signed");
                    case "Transaction already signed":
                        return this.i18nService.getTranslation("error_transaction_already_signed");
                    case "PublicKeyAnnouncement cannot be attached to transactions with no recipient":
                        return this.i18nService.getTranslation("error_public_key_announcement_no_recipient");
                    case "Announced public key does not match recipient accountId":
                        return this.i18nService.getTranslation("error_public_key_different_account_id");
                    case "Public key for this account has already been announced":
                        return this.i18nService.getTranslation("error_public_key_already_announced");
                    default:
                        if (response.errorDescription.indexOf("Alias already owned by another account") !== -1) {
                            return this.i18nService.getTranslation("error_alias_owned_by_other_account");
                        } else if (response.errorDescription.indexOf("Invalid alias sell price") !== -1) {
                            return this.i18nService.getTranslation("error_invalid_alias_sell_price");
                        } else if (response.errorDescription.indexOf("Alias hasn't been registered yet") !== -1) {
                            return this.i18nService.getTranslation("error_alias_not_yet_registered");
                        } else if (response.errorDescription.indexOf("Alias doesn't belong to sender") !== -1) {
                            return this.i18nService.getTranslation("error_alias_not_from_sender");
                        } else if (response.errorDescription.indexOf("Alias is owned by account other than recipient") !== -1) {
                            return this.i18nService.getTranslation("error_alias_not_from_recipient");
                        } else if (response.errorDescription.indexOf("Alias is not for sale") !== -1) {
                            return this.i18nService.getTranslation("error_alias_not_for_sale");
                        } else if (response.errorDescription.indexOf("Invalid alias name") !== -1) {
                            return this.i18nService.getTranslation("error_invalid_alias_name");
                        } else if (response.errorDescription.indexOf("Invalid URI length") !== -1) {
                            return this.i18nService.getTranslation("error_invalid_alias_uri_length");
                        } else if (response.errorDescription.indexOf("Invalid ask order") !== -1) {
                            return this.i18nService.getTranslation("error_invalid_ask_order");
                        } else if (response.errorDescription.indexOf("Invalid bid order") !== -1) {
                            return this.i18nService.getTranslation("error_invalid_bid_order");
                        } else if (response.errorDescription.indexOf("Goods price or quantity changed") !== -1) {
                            return this.i18nService.getTranslation("error_dgs_price_quantity_changed");
                        } else if (response.errorDescription.indexOf("Invalid digital goods price change") !== -1) {
                            return this.i18nService.getTranslation("error_invalid_dgs_price_change");
                        } else if (response.errorDescription.indexOf("Invalid digital goods refund") !== -1) {
                            return this.i18nService.getTranslation("error_invalid_dgs_refund");
                        } else if (response.errorDescription.indexOf("Purchase does not exist yet, or already delivered") !== -1) {
                            return this.i18nService.getTranslation("error_purchase_not_exist_or_delivered");
                        } else if (response.errorDescription.match(/Goods.*not yet listed or already delisted/)) {
                            return this.i18nService.getTranslation("error_dgs_not_listed");
                        } else if (response.errorDescription.match(/Delivery deadline has already expired/)) {
                            return this.i18nService.getTranslation("error_dgs_delivery_deadline_expired");
                        } else if (response.errorDescription.match(/Invalid effective balance leasing:.*recipient account.*not found or no public key published/)) {
                            return this.i18nService.getTranslation("error_invalid_balance_leasing_no_public_key");
                        } else if (response.errorDescription.indexOf("Invalid effective balance leasing") != -1) {
                            return this.i18nService.getTranslation("error_invalid_balance_leasing");
                        } else if (response.errorDescription.match(/Wrong buyer for.*expected:.*/)) {
                            return this.i18nService.getTranslation("error_wrong_buyer_for_alias");
                        } else {
                            return response.errorDescription;
                        }
                }
            case 1:
                switch (response.errorDescription) {
                    case "This request is only accepted using POST!":
                        return this.i18nService.getTranslation("error_post_only");
                    case "Incorrect request":
                        return this.i18nService.getTranslation("error_incorrect_request");
                    default:
                        return response.errorDescription;
                }
            case 2:
                return response.errorDescription;
            case 3:
                match = response.errorDescription.match(/"([^"]+)" not specified/i);
                if (match && match[1]) {
                    return this.i18nService.getTranslation("error_not_specified", {
                        "name": this.getTranslatedFieldName(match[1]).toLowerCase()
                    });
                }

                match = response.errorDescription.match(/At least one of (.*) must be specified/i);
                if (match && match[1]) {
                    var fieldNames = match[1].split(",");
                    var translatedFieldNames = [];

                    fieldNames.map((fieldName) => {
                        translatedFieldNames.push(this.getTranslatedFieldName(fieldName).toLowerCase());
                    });

                    var translatedFieldNamesJoined = translatedFieldNames.join(", ");

                    return this.i18nService.getTranslation("error_not_specified", {
                        "names": translatedFieldNamesJoined,
                        "count": translatedFieldNames.length
                    });
                } else {
                    return response.errorDescription;
                }
            case 4:
                match = response.errorDescription.match(/Incorrect "([^"]+)"/i);

                if (match && match[1]) {
                    return this.i18nService.getTranslation("error_incorrect_name", {
                        "name": this.getTranslatedFieldName(match[1]).toLowerCase()
                    });
                } else {
                    return response.errorDescription;
                }
            case 5:
                match = response.errorDescription.match(/Unknown (.*)/i);
                if (match && match[1]) {
                    return this.i18nService.getTranslation("error_unknown_name", {
                        "name": this.getTranslatedFieldName(match[1]).toLowerCase()
                    });
                }

                if (response.errorDescription === "Account is not forging") {
                    return this.i18nService.getTranslation("error_not_forging");
                } else {
                    return response.errorDescription;
                }
            case 6:
                switch (response.errorDescription) {
                    case "Not enough assets":
                        return this.i18nService.getTranslation("error_not_enough_assets");
                    case "Not enough funds":
                        return this.i18nService.getTranslation("error_not_enough_funds");
                    default:
                        return response.errorDescription;
                }
            case 7:
                if (response.errorDescription === "Not allowed") {
                    return this.i18nService.getTranslation("error_not_allowed");
                } else {
                    return response.errorDescription;
                }
            case 8:
                switch (response.errorDescription) {
                    case "Goods have not been delivered yet":
                        return this.i18nService.getTranslation("error_goods_not_delivered_yet");
                    case "Feedback already sent":
                        return this.i18nService.getTranslation("error_feedback_already_sent");
                    case "Refund already sent":
                        return this.i18nService.getTranslation("error_refund_already_sent");
                    case "Purchase already delivered":
                        return this.i18nService.getTranslation("error_purchase_already_delivered");
                    case "Decryption failed":
                        return this.i18nService.getTranslation("error_decryption_failed");
                    case "No attached message found":
                        return this.i18nService.getTranslation("error_no_attached_message");
                    case "recipient account does not have public key":
                        return this.i18nService.getTranslation("error_recipient_no_public_key");
                    default:
                        return response.errorDescription;
                }
            case 9:
                if (response.errorDescription === "Feature not available") {
                    return this.i18nService.getTranslation("error_feature_not_available");
                } else {
                    return response.errorDescription;
                }
            default:
                return response.errorDescription;
        }
    };

    private getTranslatedFieldName(name) {
        var nameKey = String(name).replace(/Planck|NQT|QNT|RS$/, "").replace(/\s+/g, "").replace(/([A-Z])/g, function ($1) {
            return "_" + $1.toLowerCase();
        });

        if (nameKey.charAt(0) === "_") {
            nameKey = nameKey.substring(1);
        }

        if (this.i18nService.data[nameKey]) {
            return this.i18nService.getTranslation(nameKey);
        } else {
            return nameKey.replace(/_/g, " ");
        }
    };
}
