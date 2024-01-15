<script lang="ts">
	import { onMount } from 'svelte';
	import '../../app.css';
	import Calendar from '../../components/calendar.svelte';
	import InsightMenu from '../../components/insightMenu.svelte';
	import { loggedUserStore } from '../../stores/loggedUser.store';
	import { goto } from '$app/navigation';

    /*
    async function getMyGroups() {
    const response = fetch('http://localhost:3000/group/myGroups', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: 1 }),
        }).then((data) => {
            return data.json();
        }).then((data) => {
            myGroups = data;
            console.log('====================================');
            // @ts-ignore
            console.log(myGroups);
            console.log('====================================');
        })
    }*/
	// @ts-ignore
	let privateChats: Array<any> = [];
	let loadedPrivateMessages: Array<any> = [];
	// @ts-ignore
	/**
	 * @type {any[]}
	 */
	let myGroups = [];

	onMount(() => {
		checkUser();
		getMyGroups();
		getMyPrivateChats();
	});

	async function checkUser() {
		if ($loggedUserStore.user_id == 0) {
			goto('/');
		}
	}

	const createBlobURL = (image_uint8array: Uint8Array) => {
    const blob = new Blob([image_uint8array], {type: 'image/jpeg'});
    return URL.createObjectURL(blob);
  };

	async function getMyPrivateChats() {
		const response = fetch('http://localhost:3000/user/get-private-messages', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ user_id: $loggedUserStore.user_id })
		})
		.then((data) => {
			return data.json();
		})
		.then((data) => {
			privateChats = data.map((item: any) => {
			const buffer = item.profile_file;
			console.log('Buffer====================================');
			console.log(buffer);
			const uint8Array = new Uint8Array(buffer.data);
			console.log('uint8array====================================');
			console.log(uint8Array);
			console.log('====================================');
			const blobURL = createBlobURL(uint8Array);
			return { ...item, profile_file: blobURL };
			});
		}) 
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

	async function getChatMessagesByUser(user_id: number) {
		const response = fetch('http://localhost:3000/private-messages/by-user-id', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				user_id: user_id,
			})
		})
		.then((data) => {data.json()})
		.then((data: any) => {
			loadedPrivateMessages = data;
		})
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
					{#each privateChats as chat}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
					class="grid grid-cols-2 border-b-2 border-gray-400 border-solid place-items-center hover:bg-gray-400"
					on:click={() => { getChatMessagesByUser(chat.user_id)}}
					>
					<img
						src="{chat.profile_file}"
						alt=""
						class="w-10 h-10 border-2 border-gray-600 border-solid rounded-full"
					/>
					<div>{chat.username}</div>
					</div>
					{/each}
					
					<!--{#each myGroups as group}
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
					{/each}-->
				</div>
			</div>
			<div class="grid h-full grid-cols-2 col-span-3 overflow-y-auto">
				Razgovor
			{#if loadedPrivateMessages.length > 0}
				{#each loadedPrivateMessages as privateMessage}
					{#if privateMessage.user_id == $loggedUserStore.user_id}
					<div>
						
					</div>
					{/if}
				{/each}
			{/if}
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
