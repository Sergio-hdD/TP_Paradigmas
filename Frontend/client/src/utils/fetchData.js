const baseURL = "http://localhost:4000/api/v1"

export const getData = async (url, token) => {
    const res = await fetch(`${baseURL}/${url}`, {
        method: 'GET',
        headers: {
            'Authorization' : token
        }
    })

    const data = await res.json()

    return data
}

export const postData = async (url, post, token) => {

    const res = await fetch(`${baseURL}/${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
        body: JSON.stringify(post)
    })

    const data = await res.json()
    return data
}

export const putData = async (url, post, token) => {
    const res = await fetch(`${baseURL}/${url}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : token
        },
        body: JSON.stringify(post)
    })

    const data = await res.json()

    return data
}

export const patchData = async (url, post, token) => {
    const res = await fetch(`${baseURL}/api/${url}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : token
        },
        body: JSON.stringify(post)
    })

    const data = await res.json()

    return data
}

export const deleteData = async (url, token) => {
    const res = await fetch(`${baseURL}/${url}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : token
        }
    })

    const data = await res.json()

    return data
}