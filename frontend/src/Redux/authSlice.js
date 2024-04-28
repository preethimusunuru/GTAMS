import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../Helper/axiosInstance";

console.log("isLoggedIn:", localStorage.getItem("isLoggedIn"));
console.log("data:", localStorage.getItem("data") || "{}");
console.log("role:", localStorage.getItem("role"));

const initialState = {
  isLoggedIn: !!localStorage.getItem("isLoggedIn"),
  data: JSON.parse(localStorage.getItem("data")),
  role: localStorage.getItem("role") || "",
};



// function to handle signup
export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
    let res = axiosInstance.post("user/register", data);
    //console.log(res);

    toast.promise(res, {
      loading: "Wait! Creating your account",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to create account",
    });

    // getting response resolved here
    res = await res;
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error.response.data;
  }
});

// function to handle login
export const login = createAsyncThunk("auth/login", async (data) => {
  try {
    let res = axiosInstance.post("/user/login", data);

    await toast.promise(res, {
      loading: "Loading...",
      success: (data) => {
        //console.log(data?.data?.message);
        return data?.data?.message;
      },
      error: (data) => {
        return data?.data?.message;
      },
    });

    // getting response resolved here
    res = await res;

    return res.data;
  } catch (error) {
    //console.log("error", error);
    toast.error(error.response.data.message);
  }
});

// function to handle logout
export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    let res = axiosInstance.post("/user/logout");

    await toast.promise(res, {
      loading: "Trying to Logout",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to Logout",
    });

    // getting response resolved here
    res = await res;
    return res.data;
  } catch (error) {
    toast.error(error.message);
  }
});

// function to fetch user data
export const getUserData = createAsyncThunk("/user/details", async () => {
  try {
    const res = await axiosInstance.get("/user/profile");
    return res?.data;
  } catch (error) {
    toast.error(error.message);
  }
});

// function to change user password
export const changePassword = createAsyncThunk(
  "/auth/changePassword",
  async (userPassword) => {
    try {
      let res = axiosInstance.post("/user/change-password", userPassword);

      await toast.promise(res, {
        loading: "Loading...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to change password",
      });

      // getting response resolved here
      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// function to handle forget password
export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async (email) => {
    try {
      let res = axiosInstance.post("/user/reset", { email });

      await toast.promise(res, {
        loading: "Loading...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to send verification email",
      });

      // getting response resolved here
      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// function to update user profile
export const updateProfile = createAsyncThunk(
  "/user/update/profile",
  async (data) => {
    try {
      //console.log("auth",data);
      let res = axiosInstance.put(`/user/update`, data);

      toast.promise(res, {
        loading: "Updating...",
        success: (data) => {
          return data?.data?.message;
        },
        error: "Failed to update profile",
      });
      // getting response resolved here
      res = await res;
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// function to reset the password
export const resetPassword = createAsyncThunk("/user/reset", async (data) => {
  try {
    let res = axiosInstance.post(`/user/reset/${data.resetToken}`, {
      password: data.password,
    });

    toast.promise(res, {
      loading: "Resetting...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to reset password",
    });
    // getting response resolved here
    res = await res;
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});


export const verifyAccount = createAsyncThunk("/user/reset", async (data) => {
  try {
    let res = axiosInstance.post(`/user/verify/${data.verificationToken}`);

    toast.promise(res, {
      loading: "Verifying...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to verify account",
    });
    // getting response resolved here
    res = await res;
    //console.log("res", res);
    return res.data;
  } catch (error) {

    // //console.log("error",error);
    toast.error(error?.response?.data?.message);
    return error.response.data;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        // console.error("Login:", action);
        if (action?.payload?.success) {
          localStorage.setItem("data", JSON.stringify(action?.payload?.user));
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("role", action?.payload?.user?.role);
          state.isLoggedIn = true;
          state.data = action?.payload?.user; // Update 'data' in Redux state
          state.role = action?.payload?.user?.role;
        } else {
          // Handle unsuccessful login (optional)
          console.error("Login failed:", action);
          // Reset 'data' in Redux state when login fails
          state.data = {};
        }
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.isLoggedIn = false;
        state.role = "";
        state.data = {}; // Clear 'data' from Redux state on logout
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        if (action?.payload?.success) {
          localStorage.setItem("data", JSON.stringify(action?.payload?.user));
          localStorage.setItem("isLoggedIn", true);
          state.isLoggedIn = true;
          state.data = action?.payload?.user;
          state.role = action?.payload?.user?.role;
        }
      });
  },
});

export const { } = authSlice.actions;
export default authSlice.reducer;
