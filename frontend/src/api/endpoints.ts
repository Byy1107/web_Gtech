import api from "./axios"

export const dashboardApi = {

stats:()=>api.get("/dashboard"),

traffic:()=>api.get("/dashboard/traffic")

}

export const mikrotikApi = {

active:()=>api.get("/mikrotik/active"),

secrets:()=>api.get("/mikrotik/secrets"),

traffic:()=>api.get("/mikrotik/traffic"),

disconnect: (username: string) =>
    api.get(`/mikrotik/disconnect/${username}`)

}