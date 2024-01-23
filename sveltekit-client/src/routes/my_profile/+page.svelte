<script lang="ts">
	import '../../app.css';
	import Calendar from '../../components/calendar.svelte';
	import InsightMenu from '../../components/insightMenu.svelte';
	import Post from '../../components/post.svelte';
	import EditProfileForm from '../../components/edit_profile_form.svelte';
	import { loggedUserStore } from '../../stores/loggedUser.store';
	import { onMount } from 'svelte';
	import { showUpdateProfileForm } from '../../stores/showUpdateProfileForm.store';

	let profile_file_URL: string = ''; 
	let cover_file_URL: string = ''; 

	function handleShowForm(){
		$showUpdateProfileForm = true;
	}

	const createBlobURL = (image_uint8array: Uint8Array) => {
    const blob = new Blob([image_uint8array], {type: 'image/jpeg'});
    return URL.createObjectURL(blob);
  };

  onMount(()=> {
	profile_file_URL = createBlobURL($loggedUserStore.profile_file);
	cover_file_URL = createBlobURL($loggedUserStore.cover_file);
  })

</script>

{#if $showUpdateProfileForm}
	<EditProfileForm></EditProfileForm>
{/if}
<div class="grid h-full grid-cols-6 bg-beige">
	<div class="h-full grid-cols-1 col-span-1">
	</div>
	<InsightMenu>
	</InsightMenu>
	<div class="relative grid col-span-3 grid-rows-4 h-4/6 ">
		<div class="absolute top-0 w-full h-64 border-2 border-solid border-b-gray-200">
			<img class="w-full h-full" src="{cover_file_URL}" alt="" />
		</div>
		<img
			class="absolute z-10 w-32 h-32 border-4 border-black border-solid rounded-full top-48 left-10"
			src="{profile_file_URL}"
			alt=""
		/>
		<div class="absolute w-full top-64">
			<div class="float-left mt-20 ml-12">
				<p class="font-bold">Ime Prezime</p>
				<p>ime.prezime@uniri.hr</p>
				<div>
					<p class="float-left mr-1"><b>235</b> pratim</p>
					<p class="float-right ml-1"><b>375</b> pratitelja</p>
				</div>
			</div>
			<button class="float-right px-4 py-1 mt-5 mr-10 bg-white border-2 border-solid rounded-full border-strongpurple place-self-end text-strongpurple" type="button" on:click={handleShowForm}>
				Uredi profil
			</button>
		</div>
		
		<div class="absolute w-5/6 top-[32rem] place-self-center">
			<Post></Post>
			<Post></Post>
		</div>
	</div>
	<div class="col-span-2"></div>
	<div class="fixed right-0 flex flex-col w-1/3 h-full bg-white">
		<div class="flex items-center justify-center text-2xl text-white h-1/6 bg-strongpurple">
			MOJ KALENDAR
		</div>
		<div class="w-full grid-rows-3 overflow-y-auto border-2 border-solid h-5/6 border-strongpurple">
			<Calendar></Calendar>
		</div>
	</div>
</div>

<style>
</style>
