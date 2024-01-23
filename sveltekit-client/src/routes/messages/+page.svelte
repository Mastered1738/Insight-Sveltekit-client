<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import '../../app.css';
	import Calendar from '../../components/calendar.svelte';
	import InsightMenu from '../../components/insightMenu.svelte';
	import { loggedUserStore } from '../../stores/loggedUser.store';
	import { goto } from '$app/navigation';
	import { io } from "socket.io-client";

	
	let privateChats: Array<any> = [];
	let loadedPrivateMessages: Array<any> = [];
	let loadedGroupMessages: Array<any> = [];
	let myGroups: Array<any> = [];
	let inputMessage: string = "Napiši poruku ovdje";
	let element: any;
	let other_user_id: number = 0;
	let searching_username: string = "";
	let chatFormVisibility: boolean = false;
	let user_list: Array<any> = [];
	let privatno = true;
	let loadedGroup: number = 0;

	const socket = io('https://seal-app-bx8q5.ondigitalocean.app');

	socket.on("private-message", (data: any) => {
		inputMessage = "Napiši poruku ovdje";
		const uint8Array1 = new Uint8Array(data.response.sender_id.profile_file.data);
		const uint8Array2 = new Uint8Array(data.response.receiver_id.profile_file.data);
		const blobURL1 = createBlobURL(uint8Array1);
		const blobURL2 = createBlobURL(uint8Array2);

		data.response.sender_id = { ...data.response.sender_id, profile_file: blobURL1 };
		data.response.receiver_id = { ...data.response.receiver_id, profile_file: blobURL2 };

		if (loadedPrivateMessages.length === 30) {
			loadedPrivateMessages.shift();
		}
		loadedPrivateMessages.push(data.response);
		loadedPrivateMessages = loadedPrivateMessages;
		scrollToBottom(element);
		console.log('====================================');
		console.log(loadedPrivateMessages);
		console.log('====================================');
	});

	socket.on('group-message', (data: any) => {
		inputMessage = "Napiši poruku ovdje";
		const uint8Array1 = new Uint8Array(data.response.sender_id.profile_file.data);
		const blobURL1 = createBlobURL(uint8Array1);

		data.response.sender_id = { ...data.response.sender_id, profile_file: blobURL1 };

		if (loadedGroupMessages.length === 30) {
			loadedGroupMessages.shift();
		}
		loadedGroupMessages.push(data.response);
		loadedGroupMessages = loadedGroupMessages;
		scrollToBottom(element);
		console.log('====================================');
		console.log(loadedGroupMessages);
		console.log('====================================');
	})

	async function joinSocketRoom(user_id: number, other_user_id: number) {
		const roomData = {
			user_id1: user_id,
			user_id2: other_user_id
		};

		socket.emit("enter-room", roomData);
	}

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

  	async function getUsersByUsername(){
		const response = await fetch('https://seal-app-bx8q5.ondigitalocean.app/user/getUsersbyUsername',{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username: searching_username })
		})
		.then((data) => {return data.json()})
		.then((data) => {
			user_list = data.map((item: any)  => {
				const buffer = item.profile_file;
				const uint8Array = new Uint8Array(buffer.data);
				const blobURL = createBlobURL(uint8Array);
				return { ...item, profile_file: blobURL };
			})
		});
	}

	async function getMyPrivateChats() {
		const response = fetch('https://seal-app-bx8q5.ondigitalocean.app/user/get-private-messages', {
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
		const response = fetch('https://seal-app-bx8q5.ondigitalocean.app/group/myGroups', {
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
		const response = fetch('https://seal-app-bx8q5.ondigitalocean.app/private-messages/by-user-id', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				user_id: $loggedUserStore.user_id,
				other_user_id: user_id,
			})
		})
		.then((data) => {
			return data.json()
		})
		.then((data: any) => {
			loadedPrivateMessages = data.map((item: any) => {
				const buffer1 = item.sender_id.profile_file;
				const buffer2 = item.receiver_id.profile_file;
				const uint8Array1 = new Uint8Array(buffer1.data);
				const uint8Array2 = new Uint8Array(buffer2.data);
				const blobURL1 = createBlobURL(uint8Array1);
				const blobURL2 = createBlobURL(uint8Array2);
				return { ...item, sender_id: {...item.sender_id, profile_file: blobURL1}, receiver_id: {...item.receiver_id, profile_file: blobURL2} };
			});
			loadedPrivateMessages.reverse();
			scrollToBottom(element);
			joinSocketRoom($loggedUserStore.user_id, user_id);
			console.log(joinSocketRoom($loggedUserStore.user_id, user_id));
			other_user_id = user_id;
		})
	}

	async function removePoruka() {
		if (inputMessage == "Napiši poruku ovdje") {
			inputMessage = "";
		}
	}

	async function putPoruka() {
		if (inputMessage == "") {
			inputMessage = "Napiši poruku ovdje";
		}
	}

	afterUpdate(() => {
		if (loadedPrivateMessages) {
			scrollToBottom(element);
		}
	});

	const scrollToBottom = async (node: any) => {
    	node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
  	}; 

	async function sendMessage() {
		socket.emit('private-message', {
			sender_id: $loggedUserStore.user_id,
			receiver_id: other_user_id,
			content: inputMessage,
		})
	}

	async function sendGroupMessage() {
		socket.emit('group-message', {
			group_id: loadedGroup,
			sender_id: $loggedUserStore.user_id,
			content: inputMessage,
		});
	}

	async function handleChatForm() {
		chatFormVisibility = !chatFormVisibility;
	}

	async function choosePrivateChats() {
		privatno = true;
	}
	async function chooseGroupChats() {
		privatno = false;
	}

	async function createNewChat(chosen_user_id: number) {

	}

	async function joinGroupSocketRoom(group_name: string) {
		socket.emit('enter-group-room', {
			group_name: group_name,
		});
	}

	async function loadGroupMessages(group_id: number){
		const response = await fetch('https://seal-app-bx8q5.ondigitalocean.app/group-message/get-messages',{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				group_id: group_id,
			})
		})
		.then((data) => {return data.json()})
		.then((data) => {
			loadedPrivateMessages = data.map((item: any) => {
				const buffer1 = item.sender_id.profile_file;
				const uint8Array1 = new Uint8Array(buffer1.data);
				const blobURL1 = createBlobURL(uint8Array1);
				return { ...item, sender_id: {...item.sender_id, profile_file: blobURL1}};
			});
			loadedPrivateMessages.reverse();
			loadedGroup = group_id;
			scrollToBottom(element);
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
				<button class="relative flex flex-col items-end w-full p-1 text-sm" on:click={handleChatForm}>+Novi razgovor</button>
				{#if chatFormVisibility == true}
				<form action="" class="fixed ">
					<input type="text" on:input={getUsersByUsername} class="pl-2 text-lg border-2 border-solid outline-none resize-none border-strongpurple" bind:value={searching_username}>
					<!--Put foreach to render all found users-->
					{#if chatFormVisibility == true}
					<div class="w-full border-2 border-solid border-strongpurple">
						{#each user_list as user}
						<button type="button" class="flex w-full pb-1 pl-2 bg-white justify-items-center hover:bg-strongpurple" on:click={() => {createNewChat(user.user_id)}}>
							<img src="{user.profile_file}" alt="" class="float-left w-10 rounded-full">
							<div class="flex justify-center">{user.username}</div>
						</button>
						{/each}
					</div>
					{/if}
				</form>
				{/if}
				<div class="grid grid-cols-2 border-b-2 border-b-solid place-items-center border-b-gray-400">
					<!--Put if statement to render either private or group chat-->
					<button type="button" class="" on:click={choosePrivateChats}>Privatno</button>
					<button type="button" class="" on:click={chooseGroupChats}>Grupe</button>
				</div>
				<div class="mt-2 overflow-y-auto">
					<!--Put a foreach for every private or group chat-->
					{#if privatno == true}
						{#each privateChats as chat}
							<button type="button"
							class="grid w-full grid-cols-2 border-b-2 border-gray-400 border-solid place-items-center hover:bg-gray-400"
							on:click={() => { getChatMessagesByUser(chat.user_id)}}
							>
							<img
								src="{chat.profile_file}"
								alt=""
								class="w-10 h-10 border-2 border-gray-600 border-solid rounded-full"
							/>
							<div>{chat.username}</div>
							</button>
						{/each}
					{:else if privatno == false}
						{#each myGroups as group }
						<button type="button" on:click={() => {loadGroupMessages(group.group_id), joinGroupSocketRoom(group.group_name)}}>
							<div>
								{group.group_name}
							</div>
						</button>
						{/each}
					{/if}
				</div>
			</div>
			<div bind:this={element} class="flex flex-col col-span-3 pl-3 pr-3 overflow-y-auto h-3/4">
			{#if privatno == true}
				{#if loadedPrivateMessages.length > 0}
					{#each loadedPrivateMessages as privateMessage}
						{#if privateMessage.sender_id.user_id == $loggedUserStore.user_id}
						<div class="flex justify-end w-full mt-3">
							<p class="max-w-md p-2 mx-2 overscroll-x-none bg-strongpink rounded-xl">{privateMessage.content}</p>
							<img src="{privateMessage.sender_id.profile_file}" alt="" class="float-right w-10 h-10 rounded-full">
						</div>
						{:else}
						<div class="flex w-full mt-3">
							<img src="{privateMessage.sender_id.profile_file}" alt="" class="w-10 h-10 rounded-full">
							<p class="max-w-md p-2 mx-2 bg-strongpurple rounded-xl">{privateMessage.content}</p>
						</div>
						{/if}
					{/each}
				{/if}
			{/if}
			{#if privatno == false}
				{#if loadedGroupMessages.length > 0}
					{#each loadedGroupMessages as groupMessage}
						{#if groupMessage.sender_id.user_id == $loggedUserStore.user_id}
						<div class="flex justify-end w-full mt-3">
							<p class="max-w-md p-2 mx-2 overscroll-x-none bg-strongpink rounded-xl">{groupMessage.content}</p>
							<img src="{groupMessage.sender_id.profile_file}" alt="" class="float-right w-10 h-10 rounded-full">
						</div>
						{:else}
						<div class="flex w-full mt-3">
							<img src="{groupMessage.sender_id.profile_file}" alt="" class="w-10 h-10 rounded-full">
							<p class="max-w-md p-2 mx-2 bg-strongpurple rounded-xl">{groupMessage.content}</p>
						</div>
						{/if}
					{/each}
				{/if}
			{/if}
			</div>
			{#if privatno == true}
			<div class="fixed bottom-0 flex flex-row justify-start h-12 border-gray-400 border-solid left-29.17% right-1/3 border-y-2 bg-beige">
				<textarea bind:value={inputMessage} on:focus={removePoruka} on:focusout={putPoruka} rows="10" cols="70" class="flex flex-col w-full p-2 overflow-auto text-lg outline-none resize-none bg-beige"></textarea>
				<button class="" type="button" on:click={sendMessage}>
					<img src="/multimedia/send.svg" alt="" class="w-8 mx-3">
				</button>
			</div>
			{:else if privatno == false}
			<div class="fixed bottom-0 flex flex-row justify-start h-12 border-gray-400 border-solid left-29.17% right-1/3 border-y-2 bg-beige">
				<textarea bind:value={inputMessage} on:focus={removePoruka} on:focusout={putPoruka} rows="10" cols="70" class="flex flex-col w-full p-2 overflow-auto text-lg outline-none resize-none bg-beige"></textarea>
				<button class="" type="button" on:click={sendGroupMessage}>
					<img src="/multimedia/send.svg" alt="" class="w-8 mx-3">
				</button>
			</div>
			{/if}
			
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
