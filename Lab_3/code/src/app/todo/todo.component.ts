import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  socket;
  toDoList;
  isUpdate=true;
  constructor(private http: HttpClient) {
    this.socket = io();
  }

  ngOnInit() {
    this.getToDos();
    this.socket.on('newTaskAdded', () => {
      this.getToDos();
    })
  }

  addToDo(value) {
    // this.toDoList.push(value);
    this.http.post('/todo', { description: value})
      .subscribe();
  }

  getToDos() {
    this.http.get('/todo')
      .subscribe((toDos) => {
        this.toDoList = toDos;
      });
  }

  update(todo){
    this.isUpdate = false;
  }
  updateTodo(todo){
    let url = '/todo/update/'+todo["_id"];
    this.http.put(url,todo)
    .subscribe();
    this.isUpdate = true;
  }

  deleteTodo(todo){
    let url = '/todo/delete/'+todo["_id"];
    this.http.delete(url)
    .subscribe();
  }
}
