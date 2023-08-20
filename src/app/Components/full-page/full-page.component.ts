import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GetusersService } from 'src/app/services/getusers.service';
import { users } from 'src/app/users/users.module';

@Component({
  selector: 'app-full-page',
  templateUrl: './full-page.component.html',
  styleUrls: ['./full-page.component.css']
})
export class FullPageComponent implements OnInit {

  users             : users[]=[];
  showusers         : users[]=[];
  searchList        : users[]=[];
  pages             : number[]=[];
  selectedUserIds   : string[]=[];
  currentPageNumber : number=1;
  isDisabled        : boolean=false;
  isChecked         : boolean=false;  
  inputvalue        : string=""; 
  element           : HTMLElement | undefined;
  editUser          : users={
                        id:'',
                        name:'',
                        email:'',
                        role:''
                      };

  constructor(private userservice:GetusersService) { }

  ngOnInit(): void {
    this.userservice.getallusers()
      .subscribe( {
          next:(users)=>{
            this.users=Object.assign(this.users,users);
            this.changeshowUsers(0,10,users);
            this.searchList=Object.assign(this.searchList,users);

            this.calculatePages(users.length);

          },
          error:(response)=>{
            console.log(response);
          }
        })
  }

  search(value:any)
  {
    this.searchList=[];

    for (let i = 0; i < this.users.length; i++) {

      if ((this.users[i].name.toUpperCase().indexOf(value.toUpperCase()) > -1) || (this.users[i].email.toUpperCase().indexOf(value.toUpperCase()) > -1)||(this.users[i].role.toUpperCase().indexOf(value.toUpperCase()) > -1)) {
        this.searchList.push(this.users[i]);
      }

    }

    this.selectedUserIds=[];
    this.isChecked=false;

    this.changeshowUsers(0,10,this.searchList);
    this.currentPageNumber=1;

    this.calculatePages(this.searchList.length);
    this.inputvalue=value;
  }

  edit(user:any)
  {
    this.editUser=Object.assign(this.editUser,user);
  }
  save(name:any,email:any,role:any)
  {
    this.editUser.name=name;
    this.editUser.email=email;
    this.editUser.role=role;

    this.assignUser(this.editUser,this.users);
    this.assignUser(this.editUser,this.showusers);
    this.assignUser(this.editUser,this.searchList);

    this.editUser=Object.assign(this.editUser,{
      id:'',
      name:'',
      email:'',
      role:''
    });

  }
  cancel(user:any)
  {
    this.editUser=Object.assign(this.editUser,{
      id:'',
      name:'',
      email:'',
      role:''
    });
  }
  delete(user:any)
  {
    var index = this.users.findIndex((item: { id: any; }) => item.id == user.id);
    this.users.splice(index,1);

    var index = this.searchList.findIndex((item: { id: any; }) => item.id == user.id);
    this.searchList.splice(index,1);
    
    this.calculatePages(this.searchList.length);

    if(this.currentPageNumber>this.pages.length)
      this.currentPageNumber-=1;

    this.changeshowUsers((this.currentPageNumber-1)*10,(this.currentPageNumber-1)*10+10,this.searchList);

  }

  assignUser(change:any,tobechanged:any)
  {
    var index = tobechanged.findIndex((item: { id: any; }) => item.id == change.id);
    tobechanged[index]=Object.assign(tobechanged[index],change);
  }
  changeshowUsers(start:number,end:number,users:any)
  {
    this.showusers=[];
    this.showusers=users.slice(start,end);
  }

  incOrDecpageNumber(val:any)
  {
    if(val=='inc')
      this.changePageNumber(this.currentPageNumber+1);
    else if(val=='dec')
      this.changePageNumber(this.currentPageNumber-1);
    else if(val=='max')
      this.changePageNumber(this.pages.length);
    else if(val=='min')
      this.changePageNumber(1);

    this.selectedUserIds=[];
    this.isChecked=false;
  }
  changePageNumber(pageNo:any)
  {
    this.changeshowUsers((pageNo-1)*10,(pageNo-1)*10+10,this.searchList);
    this.currentPageNumber=pageNo;

    this.selectedUserIds=[];
    this.isChecked=false;
  }
  calculatePages(endval:any)
  {
    if(endval%10>0)
      endval=Math.floor(endval/10)+1;
    else
      endval=Math.floor(endval/10);

    this.pages=[];

    for(let i=0;i<endval;i++)
    {
      this.pages[i]=i+1;
    }
  }

  selectuser(userid:any)
  {
    if(userid=='all')
    {
      if(this.selectedUserIds.length>0)
        this.selectedUserIds=[];
      else
        this.selectedUserIds=this.showusers.map(user => user.id);
      this.isChecked=!this.isChecked;
    }
    else
    {
      if(this.selectedUserIds.includes(userid))
      {
        var index=this.selectedUserIds.findIndex(item=>item==userid);
        this.selectedUserIds.splice(index,1);
      }
      else
      {
        this.selectedUserIds.push(userid);
      }
    }
  }

  deleteSelectedUsers()
  {
    this.users = this.users.filter((user) => !this.selectedUserIds.includes(user.id));

    if(this.users.length==0)
      this.searchList=[];
    else
      this.searchList.push.apply(this.searchList,this.users);

    this.selectedUserIds=[];
    this.isChecked=false;

    this.currentPageNumber=1;

    this.changeshowUsers(0,10,this.users);
    this.currentPageNumber=1;

    this.calculatePages(this.users.length);
    this.inputvalue="";
  }
}
