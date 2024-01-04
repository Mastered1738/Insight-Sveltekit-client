<script>
	import { onMount } from 'svelte';
	import '../../app.css';
	import Calendar from '../../components/calendar.svelte';
	import InsightMenu from '../../components/insightMenu.svelte';
	import { loggedUserStore } from '../../stores/loggedUser.store';
	import { goto } from '$app/navigation';

	// @ts-ignore
	let privateMessages;
	// @ts-ignore
	/**
	 * @type {any[]}
	 */
	let myGroups = [];

	onMount(() => {
		checkUser();
		getMyGroups();
	});

	async function checkUser() {
		if ($loggedUserStore.user_id == 0) {
			goto('/');
		}
	}

	async function getMyGroups() {
		// @ts-ignore
		const response = fetch('http://localhost:3000/group/myGroups', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ user_id: $loggedUserStore.user_id })
		})
			.then((data) => {
				return data.json();
			})
			.then((data) => {
				myGroups = data;
				console.log('====================================');
				// @ts-ignore
				console.log(myGroups);
				console.log('====================================');
			});
	}
</script>

<div class="grid h-full grid-cols-6">
	<div class="h-full grid-cols-1 col-span-1"></div>
	<InsightMenu></InsightMenu>
	<div class="relative grid h-full grid-cols-1 col-span-3">
		<div
			class="fixed flex items-center justify-center w-1/2 text-2xl text-white h-1/6 bg-darkblue border-strongpink"
		>
			MOJE PORUKE
		</div>
		<div class="fixed grid w-1/2 h-full grid-cols-4 top-1/6">
			<div class="h-full grid-cols-1 col-span-1 border-gray-400 border-solid border-x-2">
				<button class="relative flex flex-col items-end w-full p-1 text-sm">+Novi razgovor</button>
				<div class="grid grid-cols-2 place-items-center">
					<!--Put if statement to render either private or group chat-->
					<div class="">Privatno</div>
					<div class="">Grupe</div>
				</div>
				<div class="mt-2 overflow-y-auto">
					<!--Put a foreach for every private or group chat-->
					<div
						class="grid grid-cols-2 border-b-2 border-gray-400 border-solid place-items-center hover:bg-gray-400"
					>
						<img
							src="/multimedia/anonymous-user.webp"
							alt=""
							class="w-10 border-2 border-gray-600 border-solid rounded-full"
						/>
						<div>Ime Prezime</div>
					</div>
					{#each myGroups as group}
						<div
							class="grid grid-cols-2 border-b-2 border-gray-400 border-solid place-items-center hover:bg-gray-400"
						>
							<img
								src="/multimedia/anonymous-user.webp"
								alt=""
								class="w-10 border-2 border-gray-600 border-solid rounded-full"
							/>
							<div>
								{group.group_name}
							</div>
						</div>
					{/each}
				</div>
			</div>
			<div class="grid h-full grid-cols-2 col-span-3 overflow-y-auto">
				Razgovor
				<!--Put a foreach for every message-->
			</div>
		</div>
	</div>
	<div class="col-span-2"></div>
	<div class="fixed right-0 flex flex-col w-1/3 h-full bg-white">
		<div class="flex items-center justify-center text-2xl text-white h-1/6 bg-strongpurple">
			MOJ KALENDAR
		</div>
		<div
			class="w-full grid-rows-3 overflow-y-auto border-l-2 border-solid h-5/6 border-strongpurple"
		>
			<Calendar></Calendar>
		</div>
	</div>
</div>

<style>
	:global(html) {
		background-color: #f8f7f4;
	}
</style>
