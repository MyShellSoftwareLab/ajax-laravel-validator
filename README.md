
# ajax-laravel-validator

Include ALV in your project
````
    <!--ALV-->
    <script src="{{ asset('plugins/ajax-laravel-validator/dist/libs/jquery.form.js') }}"></script>
    <script src="{{ asset('plugins/ajax-laravel-validator/dist/alv.js') }}"></script>
````
# Example

#### You need add a id to you form 

````
<form method="POST" action="http://1.2.3.4/users" id="users">
````

#### Then initialize ALV on its jQuery selector
````
    <script>  
      $('#users').alv()  
    </script>
````

#### In your controller you must return the route to which "ALL" will return after execute your process on the controller
````
return ['route' => route('users.index')];
````
