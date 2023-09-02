import React, {
  useState,
  useEffect
} from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Input,
  VStack,
  Checkbox,
  HStack,
  Container,
  Heading,
  Center
} from '@chakra-ui/react';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');

  useEffect(() => {
    const fetchTodos = async (): Promise<void> => {
      const response = await axios.get<Todo[]>('http://localhost:5000/todos');
      setTodos(response.data);
    };

    fetchTodos();
  }, []);

  const addTodo = async (): Promise<void> => {
    const response = await axios.post<Todo>('http://localhost:5000/todos', {
      title: newTodo,
      completed: false
    });

    setTodos([...todos, response.data]);
    setNewTodo('');
  };

  const updateTodo = async (id: number, title: string): Promise<void> => {
    const updatedTodo = { title, completed: false };
    await axios.put(`http://localhost:5000/todos/${id}`);
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, title } : todo)));
  };

  const deleteTodo = async (id: number): Promise<void> => {
    await axios.delete(`http://localhost:5000/todos/${id}`);
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = async (id: number): Promise<void> => {
    const todo = todos.find(todo => todo.id === id);

    if (todo) {
      const updatedTodo = { ...todo, completed: !todo.completed };
      await axios.put(`http://localhost:5000/todos/${id}`, updatedTodo);
      setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
    }
  };

  return (
    <Container maxW="container.md" p={5}>
      <Center>
        <Heading mb={5}>Simple Todo App</Heading>
      </Center>

      <Input
        value={ newTodo }
        onChange={
          (e) => setNewTodo(e.target.value)
        }
        placeholder="Add a new todo"
      />

      <Center mt={2} mb={5}>
        <Button
          onClick={ addTodo }
          mt={2}
        >Add Todo</Button>
      </Center>

      <VStack spacing={ 4 }>
        { todos.map(todo => (
          <HStack key={ todo.id }>
            <Checkbox
              isChecked={ todo.completed }
              onChange={
                () => toggleComplete(todo.id)
              }
            />
            <Input
              defaultValue={ todo.title }
              onBlur={
                (e) => updateTodo(todo.id, e.target.value)
              }
            />
            <Button onClick={
              () => deleteTodo(todo.id)
            }>
              Delete
            </Button>
          </HStack>
        ))}
      </VStack>
    </Container>
  );
};

export default App;
