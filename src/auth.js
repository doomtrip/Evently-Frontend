export default {
  async login(credentials) {
    const testUsers = {
      'admin': { 
        password: 'admin', 
        role: 'admin',
        login: 'admin',
        firstName: 'Admin',
        lastName: 'User'
      }
    };

    const user = testUsers[credentials.loginOrEmail];
    
    if (user && credentials.password === user.password) {
      const token = btoa(JSON.stringify(user));
      localStorage.setItem('authToken', token);
      return { token };
    }
    
    throw new Error('Неверные учетные данные');
  }
};