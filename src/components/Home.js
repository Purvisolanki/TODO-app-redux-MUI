import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, handleAddValue, updateUser } from "./UserReducer";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import PrimarySearchAppBar from "./Navbar";
import { Grid } from "@mui/material";

function Home() {
  const [editData, setEditData] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false); 
  const [viewData, setViewData] = useState(null);
  const [search, setSearch] = useState("");
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [addDialog, setAddDialog] = useState(false);

  const handleClickOpen = (data = null) => {
    if (data) {
      setEditData(data);
    } else {
      setEditData(null);
    }
    setAddDialog(true);
  };

  const handleClose = () => {
    setAddDialog(false);
    setEditData(null);
  };

  const handleViewOpen = (data) => {
    setViewData(data);
    setViewDialogOpen(true);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
    setViewData(null);
  };

  const handleSubmit = async (values, { resetForm }) => {
    if (editData) {
      dispatch(updateUser({ ...editData, ...values }));
    } else {
      const timestamp = new Date().getTime();
      const uniqueId = users.length + 1 + "_" + timestamp;
      dispatch(handleAddValue({ id: uniqueId, ...values }));
    }
    handleClose();
    resetForm();
  };

  const handleDelete = (id) => {
    dispatch(deleteUser({ id }));
    setDeleteDialogOpen(null);
  };

  const handleUpdate = (user) => {
    handleClickOpen(user);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().min(3, "Too short").required("Required"),
    description: Yup.string().required("Required"),
  });

  return (
    <>
      <PrimarySearchAppBar setSearch={setSearch} />
      <Grid container justifyContent="center" alignItems="center">
        <Grid sx={{ width: "80%" }}>
          <h2>TODO APP</h2>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" onClick={() => handleClickOpen()}>
              Add Task
            </Button>
          </div>
          <Dialog open={addDialog} onClose={handleClose}>
            <Formik
              initialValues={{
                name: editData ? editData.name : "",
                description: editData ? editData.description : "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <DialogTitle>
                    {editData ? "Edit Task" : "Add Task"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      To {editData ? "edit" : "add"} task, please enter
                      details
                    </DialogContentText>
                    <Field
                      autoFocus
                      margin="dense"
                      id="name"
                      name="name"
                      label="Name"
                      type="text"
                      fullWidth
                      as={TextField}
                    />
                    <ErrorMessage name="name" />
                    <Field
                      margin="dense"
                      id="description"
                      name="description"
                      label="task description"
                      type="text"
                      fullWidth
                      as={TextField}
                    />
                    <ErrorMessage name="description" />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {editData ? "Edit" : "Add"}
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          </Dialog>
          <div>
            <h3>List of Tasks</h3>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>S No.</TableCell>
                    <TableCell>Task Name</TableCell>
                    <TableCell>Task Description</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users
                    .filter((user) =>
                      user.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((user, index) => (
                      <TableRow
                        key={user.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell component="th" scope="row">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.description}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            onClick={() => handleViewOpen(user)} // Open view dialog
                          >
                            View
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => handleUpdate(user)}
                            style={{ marginLeft: 10 }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => setDeleteDialogOpen(user.id)}
                            style={{ marginLeft: 10 }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Dialog
              open={Boolean(deleteDialogOpen)}
              onClose={() => setDeleteDialogOpen(null)}
            >
              <DialogTitle>Delete Task</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this task?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeleteDialogOpen(null)}>Cancel</Button>
                <Button onClick={() => handleDelete(deleteDialogOpen)} autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
            {/* View Dialog */}
            <Dialog open={viewDialogOpen} onClose={handleViewClose}>
              <DialogTitle>Task Details</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  <strong>Name: </strong> {viewData && viewData.name}
                </DialogContentText>
                <DialogContentText>
                  <strong>Description:</strong>{" "}
                  {viewData && viewData.description}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleViewClose}>Close</Button>
              </DialogActions>
            </Dialog>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default Home;
