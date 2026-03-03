from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uuid

app = FastAPI()

# Allow Next.js frontend (localhost:3000) to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (replace with a database in production)
todos = []


class Todo(BaseModel):
    text: str


class TodoItem(BaseModel):
    id: str
    text: str
    done: bool


@app.get("/api/todos", response_model=List[TodoItem])
def get_todos():
    return todos


@app.post("/api/todos", response_model=TodoItem)
def create_todo(todo: Todo):
    new_todo = TodoItem(id=str(uuid.uuid4()), text=todo.text, done=False)
    todos.append(new_todo)
    return new_todo


@app.patch("/api/todos/{todo_id}", response_model=TodoItem)
def toggle_todo(todo_id: str):
    for todo in todos:
        if todo.id == todo_id:
            todo.done = not todo.done
            return todo
    return {"error": "Not found"}


@app.delete("/api/todos/{todo_id}")
def delete_todo(todo_id: str):
    global todos
    todos = [t for t in todos if t.id != todo_id]
    return {"message": "Deleted"}
