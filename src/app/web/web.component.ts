import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
@Component({
  selector: 'app-web',
  templateUrl: './web.component.html',
  styleUrls: ['./web.component.css']
})
export class WebComponent implements OnInit {

  login: boolean = true;
  
  constructor(private router: Router) {
    // on route change to '/login', set the variable showHead to false
      router.events.forEach((event) => {
        if (event instanceof NavigationStart) {
          if (event['url'] == '/login') {
            this.login= true;
          } else {
            this.login= false;
          }
        }
      });
    }

  ngOnInit(): void {
  }

}
