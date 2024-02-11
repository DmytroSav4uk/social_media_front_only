const baseUrl = 'http://44.202.162.130:8080/api';
const photoUrl ='http://44.202.162.130:8080/api/profile/download/'

const webSocket = "ws://44.202.162.130:8080"



const urls = {

  authReg: {
    register: `${baseUrl}/auth/signup`,
    auth: `${baseUrl}/auth/signin`,
    refresh: `${baseUrl}/auth/refresh`
  },

  profile: {
    editProfile: `${baseUrl}/profile/edit`,
    my: `${baseUrl}/profile/my`,
    profile:`${baseUrl}/profile/`,
    uploadPhoto: `${baseUrl}/profile/upload/photo`,
    uploadBackPhoto:`${baseUrl}/profile/background/photo`
  },

  user: {
    all: `${baseUrl}/users/allfields`
  },


  liveChat:{
    live:`${baseUrl}/livechat`
  },

  chat: {
    all: `${baseUrl}/chat/rooms`,
    allGroupChats: `${baseUrl}/chat/party`,
    view: `${baseUrl}/chat/view`,
    viewGroupChat: `${baseUrl}/chat/viewparty`,
    update: `${baseUrl}/chat/update`,
    updateGroup:`${baseUrl}/chat/updateparty`,
    createNewRoom: `${baseUrl}/chat/create`,
    sendMessage: `${baseUrl}/chat/send`,
    sendMessageToParty: `${baseUrl}/chat/sendtoparty`,
    editMessage: `${baseUrl}/chat/edit`,
    deleteForMe: `${baseUrl}/chat/delete`,
    deleteForAll: `${baseUrl}/chat/deleteForAll`,
    upload: `${baseUrl}/chat/upload`,
    uploadParty: `${baseUrl}/chat/uploadparty`,
    uploadAudio: `${baseUrl}/chat/uploadAudio`
  },


  friends:{
    myFriends:`${baseUrl}/friendship/my`,
    sendRequest:`${baseUrl}/friendship/send/`,
    pending:`${baseUrl}/friendship/pending`,

    accept:`${baseUrl}/friendship/accept/`,
    deny:`${baseUrl}/friendship/deny/`,
  },

  publications:{
    publications:`${baseUrl}/publication`,
    myPublications:`${baseUrl}/publication/my`,
    publicationsByUser:`${baseUrl}/publication/user/`,
    like:`${baseUrl}/publication/addLike/`,
    comment:`${baseUrl}/publication/addComment/`
  }
};

export {urls,photoUrl,webSocket};
