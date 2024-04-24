import {createSlice} from '@reduxjs/toolkit';
import  {userList}  from './Data';

const userSlice = createSlice({
    name:"users",
    initialState: userList,
    reducers:{
        handleAddValue : (state,action) => {
            state.push(action.payload);
        },
        updateUser : (state,action) => {
            const {id,name,description} = action.payload;
            const uu = state.find(user => user.id == id);
            if(uu){
                uu.name = name;
                uu.description = description;
            }
        },
        deleteUser: (state,action) => {
            const {id} = action.payload;
            const uu = state.find(user => user.id == id);
            if(uu) {
                return state.filter(f => f.id !== id);
            }
        }
    }
})
export const {handleAddValue,updateUser,deleteUser} = userSlice.actions;
export default userSlice.reducer;