/* 
    FairOS is a decentralized storage system that allows users to store data on their own.
    This functions allows users to communicate with a FairOS host.
    The FairOS host is a server that runs the FairOS software.
    Written by: TexData for Fair Data Society
    MIT License
*/
export const fairOShost =
  process.env.REACT_APP_FAIROSHOST === undefined
    ? "https://fairos.dev.fairdatasociety.org/"
    : process.env.REACT_APP_FAIROSHOST;

export async function userLogin(host, user, pass) {
  var data = {
    userName: user,
    password: pass,
  };
  return await fetch(host + "v2/user/login", {
    method: "POST",
    //mode: "no-cors",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });
}

export async function userLoggedIn(host, username) {
  var data = {
    userName: username,
  };
  return await fetch(host + "v1/user/isloggedin" + "?" + new URLSearchParams(data), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}

export async function podLs(host, password) {
  var data = {
    podName: "",
    password: password,
  };
  return fetch(host + "v1/pod/ls" + "?" + new URLSearchParams(data), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}

export async function dirLs(host, podName, dirpath) {
  var data = {
    podName: podName,
    dirPath: dirpath, // "/"
  };
  return fetch(host + "v1/dir/ls" + "?" + new URLSearchParams(data), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}

export async function podOpen(host, podName, password) {
  var data = {
    podName: podName,
    password: password,
  };
  return fetch(host + "v1/pod/open" + "?" + new URLSearchParams(data), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });
}

export async function podDelete(host, podName, password) {
  var data = {
    podName: podName,
    password: password,
  };
  return fetch(host + "v1/pod/delete" + "?" + new URLSearchParams(data), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });
}

export async function podNew(host, podName, password) {
  var data = {
    podName: podName,
    password: password,
  };
  var res = await fetch(host + "v1/pod/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  console.log(await res.json(), data);
  return res;
}

export async function downloadFile(host, podName, dirPath, filename) {
  var data = {
    filePath: dirPath + filename, // "/index.json"
    podName: podName,
  };

  return await fetch(host + "v1/file/download" + "?" + new URLSearchParams(data), {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(data),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function uploadObjectAsFile(host, podName, dirPath, filename, object, overwrite = false) {
  const formData = new FormData();

  const stringify = JSON.stringify(object);
  const blob = new Blob([stringify], { type: "application/json" });
  const file = new File([blob], filename);

  formData.append("files", file);
  formData.set("podName", podName);
  formData.append("fileName", filename); //"index.json");
  formData.set("dirPath", dirPath); // "/");
  formData.set("blockSize", "1Mb");

  if (overwrite === true) formData.set("overwrite", "true");

  return await fetch(host + "v1/file/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
}
