import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

export default function App() {
  const [task, setTask] = useState("");
  const [editedTask, setEditedTask] = useState("");
  const [todolist, setTodoList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [id, setId] = useState("");

  let url = "https://todo-backend-khaki.vercel.app/api/todo";

  // Function to open modal
  const openModal = (id, task) => {
    setIsModalVisible(true);
    setId(id);
    setEditedTask(task);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Add task
  const addTODO = async () => {
    if (task.length > 0) {
      let response = await axios.post(`${url}/add`, {
        task,
      });
      getTODO();
    } else {
      alert("please add task");
    }
  };

  // edit task funtion
  const editTODO = async () => {
    let response = await axios.put(`${url}/edit`, {
      task: editedTask,
      _id: id,
    });
    getTODO();
    closeModal();
  };
  // status update function
  const statusTODO = async ({ _id, status }) => {
    let response = await axios.put(`${url}/status`, {
      _id,
      status: !status,
    });
    getTODO();
  };
  //delete funtion
  const deleteTODO = async ({ _id }) => {
    let response = await axios.delete(`${url}/delete/${_id}`);
    getTODO();
  };
  // get all function
  const getTODO = async () => {
    let response = await fetch(`${url}/get`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    let data = await response.json();
    setTodoList(data.getalltodo);
    console.log("data", data);
  };

  useEffect(() => {
    getTODO();
  }, []);
  console.log("todolist", todolist);

  return (
    <View style={styles.container}>
      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Edit task"
              onChangeText={(text) => setEditedTask(text)}
              value={editedTask}
            />
            <View style={styles.listButton}>
              <Button style={styles.button} title="Save" onPress={editTODO} />
              <Button
                style={styles.button}
                title="Cancel"
                onPress={closeModal}
              />
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.main}>
        <Text style={styles.title}>TODO Application</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task"
          onChangeText={(text) => setTask(text)}
          value={task}
        />
        <Button title="Add" onPress={addTODO} />

        <View style={styles.listcontainer}>
          {todolist &&
            todolist.map((val, idx) => (
              <View key={idx} style={styles.listbox}>
                <View>
                  <Text style={styles.heading}>{val.task}</Text>
                  <Text>created date: {val.date}</Text>
                </View>
                <View style={styles.listButton}>
                  <Button
                    style={styles.button}
                    onPress={() => openModal(val._id, val.task)}
                    title="Edit"
                  />
                  <Button
                    style={styles.button}
                    title="Delete"
                    onPress={() => deleteTODO({ _id: val._id })}
                  />
                </View>
                <View>
                  <Button
                    onPress={() =>
                      statusTODO({ _id: val._id, status: val.completed })
                    }
                    title={val.completed ? "completed" : "notCompleted"}
                  />
                  {/* <View
                    onPress={() =>
                      statusTODO({ _id: val._id, status: val.completed })
                    }
                  >
                    {val.completed ? (
                      <Text>Completed</Text>
                    ) : (
                      <Text>notCompleted</Text>
                    )}
                  </View> */}
                </View>
              </View>
            ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "auto",
  },
  main: {
    height: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    padding: 20,
  },
  heading: {
    fontSize: 15,
    fontWeight: "bold",
    padding: 10,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  listcontainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  listbox: {
    margin: 25,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  listboxHovered: {
    backgroundColor: "#D20062",
  },
  listButton: {
    flexDirection: "row",
    justifyContent: "around",
    margin: 10,
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  button: {
    margin: 10,
    padding: 10,
    borderColor: "#D20062",
    borderWidth: 1,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
});
