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

	let userRegisterEmail: string = "";
	let userRegisterUsername: string = "";
	let userRegisterPassword: string = "";

	let LogInbool: boolean = true;

	const localProfileFileImagePatch = '/multimedia/anonymous-user.webp';
	const localCoverFileImagePatch = '/multimedia/cover-photo.png';

	async function LogIn(){
		const response = fetch('https://seal-app-bx8q5.ondigitalocean.app/user/logIn', {
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
				if (data.profile_file == null || data.cover_file == null ) {
					fetch(localProfileFileImagePatch)
					.then(response => response.arrayBuffer())
					.then(buffer => {
						$loggedUserStore.profile_file = new Uint8Array(buffer);
					});
					fetch(localCoverFileImagePatch)
					.then(response => response.arrayBuffer())
					.then(buffer => {
						$loggedUserStore.cover_file = new Uint8Array(buffer);
					});
				goto('/my_profile');
				}
				else {
					$loggedUserStore.profile_file = new Uint8Array(data.profile_file.data);
					$loggedUserStore.cover_file = new Uint8Array(data.cover_file.data);
				goto('/my_profile');
				}
			}
			else{

			}
		});	
	}

	async function registerUser() {
		const response = await fetch('https://seal-app-bx8q5.ondigitalocean.app/user/create-user', {
			method: 'POST',
			headers: {
            'Content-Type': 'application/json',
            },
			body: JSON.stringify({ 
				username: userRegisterUsername,
				password: userRegisterPassword,
				email: userRegisterEmail, 
			}),
		})
		.then((data) => { return data.json(); })
		.then((data) => {
			if(data != null) {
				switchLogInOrRegister();
			}
		})
	}
	

	async function switchLogInOrRegister() {
		LogInbool = !LogInbool;
	}
</script>

<div class="relative flex items-center justify-center h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500">
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	{#if LogInbool == true}
	<img class="absolute z-10 w-24 top-36" src="/multimedia/Logo.png" alt="Insight logo" on:click={switchLogInOrRegister} />
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
	{:else}
	<img class="absolute z-10 w-24 top-24" src="/multimedia/Logo.png" alt="Insight logo" on:click={switchLogInOrRegister} />
		<form
		action=""
		class="absolute grid grid-cols-1 pb-6 space-y-6 place-items-center bg-beige rounded-xl w-80"
	>
		<h1 class="mt-16 text-2xl text-darkblue">Insight</h1>
		<div class="grid grid-cols-1 place-items-start">
			<label for="">Email:</label>
			<input type="text" class="px-3 py-1 bg-bgbrown rounded-xl" id="passwordInput" bind:value={userRegisterEmail}/>
		</div>
		<div class="grid grid-cols-1 place-items-start">
			<label for="">Korisnicko ime:</label>
			<input type="text" class="px-3 py-1 bg-bgbrown rounded-xl" id="usernameInput" bind:value={userRegisterUsername}/>
		</div>
		<div class="grid grid-cols-1 place-items-start">
			<label for="">Lozinka:</label>
			<input type="password" class="px-3 py-1 bg-bgbrown rounded-xl" id="passwordInput" bind:value={userRegisterPassword}/>
		</div>
		<button class="px-20 py-1 bg-darkblue text-beige rounded-xl hover:bg-strongpurple" on:click={registerUser} type="submit">Registriraj se!</button>
	</form>
	{/if}
	
</div>

<style lang="postcss">
</style>
