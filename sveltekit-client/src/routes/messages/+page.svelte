<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import '../../app.css';
	import Calendar from '../../components/calendar.svelte';
	import InsightMenu from '../../components/insightMenu.svelte';
	import { loggedUserStore } from '../../stores/loggedUser.store';
	import { goto } from '$app/navigation';
	import { io } from "socket.io-client";
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
	let inputMessage: string = "Napiši poruku ovdje";
	let other_user_id: number = 0;
	let element: any;

	const socket = io();

	socket.on("private-message", (data) => {
		console.log(data);
	});

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
				user_id: $loggedUserStore.user_id,
				other_user_id: user_id,
			})
		})
		.then((data) => {
			return data.json()
		})
		.then((data: any) => {
			other_user_id = user_id;
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

	/*async function sendMessage(){
		const response = await fetch('http://localhost:3000/private-messages/send-message',{
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				sender_id: $loggedUserStore.user_id,
				receiver_id: other_user_id,
				content: inputMessage,
			}),
		})
		.then((data) => {
			return data.json()
		})
		.then((data) => {
            inputMessage = "Napiši poruku ovdje";
            const uint8Array1 = new Uint8Array(data.sender_id.profile_file.data);
            const uint8Array2 = new Uint8Array(data.receiver_id.profile_file.data);
            const blobURL1 = createBlobURL(uint8Array1);
            const blobURL2 = createBlobURL(uint8Array2);

            data.sender_id = { ...data.sender_id, profile_file: blobURL1 };
            data.receiver_id = { ...data.receiver_id, profile_file: blobURL2 };

            if (loadedPrivateMessages.length === 30) {
                loadedPrivateMessages.shift();
            }
            loadedPrivateMessages.push(data);
			loadedPrivateMessages = loadedPrivateMessages;
			scrollToBottom(element);
        });
	}*/

	async function sendMessage() {
		
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
					
					<!--{#each myGroups as group}mr-
							</div>
						</div>
					{/each}-->
				</div>
			</div>
			<div class="flex bind:this={element} flex-col col-span-3 pl-3 pr-3 overflow-y-auto h-3/4">
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
			</div>
			<div class="fixed bottom-0 flex flex-row justify-start h-12 border-gray-400 border-solid left-29.17% right-1/3 border-y-2 bg-beige">
				<textarea bind:value={inputMessage} on:focus={removePoruka} on:focusout={putPoruka} rows="10" cols="70" class="flex flex-col w-full p-2 overflow-auto text-lg outline-none resize-none bg-beige"></textarea>
				<button class="" type="button" on:click={sendMessage}>
					<img src="/multimedia/send.svg" alt="" class="w-8 mx-3">
				</button>
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
