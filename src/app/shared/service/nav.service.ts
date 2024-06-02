import {Injectable, HostListener, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, Subscriber} from 'rxjs';
import {AuthService} from './auth.service';
import {WINDOW} from './windows.service';
import {MenuTree} from '../models/menu.inteface';
import {RoleService} from './roles/role.service';
import {Result} from '../models/result';

// Menu


@Injectable({
    providedIn: 'root',
})
export class NavService {
    pdrVenta: boolean;
    public screenWidth: any;
    public collapseSidebar: boolean = false;
    treeMenu: any[] = [];
    MENUITEMS: MenuTree[] = [];

    constructor(@Inject(WINDOW) private window, private authRutes: AuthService
        , private router: Router
        , private apiRole: RoleService) {
        this.onResize();
        if (this.screenWidth < 991) {
            this.collapseSidebar = true;
        }
        // this.MENUITEMS = this.authRutes.getUserInfo().menu;
    }

    // Windows width
    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        this.screenWidth = window.innerWidth;
    }

    itemMenu(): Observable<MenuTree[]> {
        return new Observable((observer) => {
            this.apiRole.getListMenuRole().subscribe({
                next: (resp: Result) => {
                    console.log(resp);
                    this.MENUITEMS = resp.payload.data;
                    observer.next(this.MENUITEMS);
                    observer.complete();
                    console.log(this.MENUITEMS);
                },
                error: (error) => {
                    console.error('Error fetching menu role', error);
                    observer.error(error);
                }
            });
        });
    }

    // items(): Observable<Menu[]> {
    //     return new Observable((observer: Subscriber<Menu[]>) => {
    //         // observer.next(this.menuItem());
    //         observer.next(this.MENUITEMS);
    //         observer.complete();
    //     });
    // }

    // items = new BehaviorSubject<Menu[]>(this.menuItem());
}
