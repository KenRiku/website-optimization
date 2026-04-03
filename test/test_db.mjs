// Test the signup API and check for errors
const response = await fetch('http://localhost:3000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Test User', email: 'testdb@example.com', password: 'Password123!' })
});

console.log('Status:', response.status);
const data = await response.json();
console.log('Response:', data);
