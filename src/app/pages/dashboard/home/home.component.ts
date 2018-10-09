import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { MatTableDataSource, MatSort } from '@angular/material';
import { Transaction, Account } from '../../../lib/model';
import { AccountService, StoreService } from '../../../lib/services';
import { Converter } from '../../../lib/util';

@Component({
    selector: 'app-home',
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html'
})
export class HomeComponent {
    displayedColumns = ['type', 'opposite', 'amount', 'fee', 'timestamp', 'confirmed'];
    recentTransactionData;
    account: Account;
    navigationSubscription;

    constructor(
        private storeService: StoreService,
        private accountService: AccountService,
        private router: Router,
    ) {

        // handle route reloads (i.e. if user changes accounts)
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
                this.fetchTransactions();
            }
        });
            
    }

    fetchTransactions() {
        this.storeService.getSelectedAccount()
            .then((account) => {
                this.account = account;
                this.accountService.getTransactions(account.id)
                    .then((transactions) => {
                        console.log(transactions);
                        this.recentTransactionData = new MatTableDataSource<Transaction>(transactions);
                        this.recentTransactionData.sort = this.sort;
                    })
            })
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.recentTransactionData.filter = filterValue;
    }

    @ViewChild(MatSort) sort: MatSort;

    public isOwnAccount(address: string): boolean {
        return address != undefined && address === this.account.address;
    }

    public convertTimestamp(timestamp: number): Date {
        return Converter.convertTimestampToDate(timestamp);
    }

    ngOnDestroy() {
        if (this.navigationSubscription) {  
            this.navigationSubscription.unsubscribe();
        }
    }

}