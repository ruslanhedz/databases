# SQl injection

One of goals of this project was presenting how sql injection works. The branch 'Phase-3' was created just for it.

# Disclaimer! The code in branch 'Phase-3' is vulnarable to sql injection!!!!

Here is some lines in code from the brach 'Phase-3' that make the program vulnarable to sql injection atack:

```python
@csrf_exempt
def vulnerable_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        # Vulnerable raw SQL query
        query = f"SELECT * FROM auth_user WHERE username = '{username}' AND password = '{password}'"
        cursor = connection.cursor()
        cursor.execute(query)
        #cursor.execute(query, [username, password])
        user = cursor.fetchone()  # Fetch one result

        if user:
            user_obj = User.objects.get(id=user[0])  # Get the User object from the ID
            refresh = RefreshToken.for_user(user_obj)
            return JsonResponse({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
```
