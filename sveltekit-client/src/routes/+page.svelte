<script lang="ts">
	import '../app.css';
	import type UserLoginInterface from '../interfaces/UserLogIn.interface';
	import type LoggedUserInterface from '../interfaces/loggedUser.interface';
	import { loggedUserStore } from '../stores/loggedUser.store';
	import { goto } from '$app/navigation';
	
	let user: UserLoginInterface = {
		username: '',
		password: ''
	}

	let foundUser: LoggedUserInterface = {
		user_id: 0,
		email: '',
		username: '',
		user_type: 0,
	}

	function LogIn(){
		const response = fetch('http://localhost:3000/user/logIn', {
			method: 'POST',
			headers: {
            'Content-Type': 'application/json',
            },
			body: JSON.stringify({ 
				username: user.username,
				password: user.password, 
			}),
		}).then(
			response => {
				console.log('====================================');
				console.log(response);
				console.log('====================================');
				return response.json();}
		).then(data => {
			if (data != null) {
				$loggedUserStore.user_id = data.user_id;
				$loggedUserStore.email = data.email;
				$loggedUserStore.username = data.username;
				$loggedUserStore.user_type = data.user_type.user_type_id;
				console.log('====================================');
				console.log($loggedUserStore.user_id);
				console.log('====================================');
				//window.location.assign('./my_profile');
				goto('/my_profile');
			}
			else{

			}
		});	
	}
</script>

<div class="relative flex items-center justify-center h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500">
	<img class="absolute z-10 w-24 top-36" src="/multimedia/Logo.png" alt="Insight logo" />
	<form
		action=""
		class="absolute grid grid-cols-1 pb-6 space-y-6 place-items-center bg-beige rounded-xl w-80"
	>
		<h1 class="mt-16 text-2xl text-darkblue">Insight</h1>
		<div class="grid grid-cols-1 place-items-start">
			<label for="">Korisnicko ime:</label>
			<input type="text" class="px-3 py-1 bg-bgbrown rounded-xl" id="usernameInput" bind:value={user.username}/>
		</div>
		<div class="grid grid-cols-1 place-items-start">
			<label for="">Lozinka:</label>
			<input type="password" class="px-3 py-1 bg-bgbrown rounded-xl" id="passwordInput" bind:value={user.password}/>
		</div>
		<button class="px-20 py-1 bg-darkblue text-beige rounded-xl hover:bg-strongpurple" on:click={LogIn} type="submit">Log in</button>
	</form>
</div>

<style lang="postcss">
</style>
