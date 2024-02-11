import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'friendfilter'
})
export class FriendfilterPipe implements PipeTransform {

  transform(users: any[], searchText: string): any[] {
    console.log('Users before filter:', users);
    if (!users || !searchText) {
      return users;
    }

    searchText = searchText.toLowerCase();

    const filteredUsers = users.filter((user) => {
      const fullName = user.profile.name.toLowerCase() + ' ' + user.profile.surname.toLowerCase();
      return fullName.includes(searchText);
    });

    console.log('Filtered users:', filteredUsers);

    return filteredUsers;
  }

}
