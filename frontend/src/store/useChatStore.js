import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axios";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessageLoading: false,
    
    setSelectedUser : (user)=>{
        set({selectedUser: user})
    },

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/messages/users');
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessageLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
            
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessageLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const {selectedUser, messages} = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        } 
    },

    subscribeToMessages: ()=>{
        const { socket } = useAuthStore.getState();
        const { messages, selectedUser } = get();

        if(!selectedUser) return;

        socket.on('newMessage', (newMessage)=>{
            if(newMessage.senderId != selectedUser._id) return;
            set({messages: [...messages, newMessage]})
        })
    },
    unSubscribeToMessages: ()=>{
        const { socket } = useAuthStore.getState();
        socket.off('newMessage');
    },


}));
