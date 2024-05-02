interface User {
  id: number;
  name: string;
  display: string;
  password?: string;
}

export const mockUsers: User[] = [
  {id: 1, name: "Tush", display: "tushy1", password: "tushyy1"},
  {id: 2, name: "Josh", display: "Josshy", password: "joshy3"},
  {id: 3, name: "Michael", display: "Mich43", password: "mich"},
  {id: 4, name: "Newman", display: "newman", password: "newman1"},
];
