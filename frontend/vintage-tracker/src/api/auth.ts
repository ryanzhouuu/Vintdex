export const signUp = async (email: string, password: string) => {
    const res = await fetch('https://localhost:5000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    return res.json();
}

export const login = async (email: string, password: string) => {
    const res = await fetch('https://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })

    return res.json();
}

export const logout = async () => {
    await fetch('http://localhost:5000/auth/logout', { method: 'POST' });
  };