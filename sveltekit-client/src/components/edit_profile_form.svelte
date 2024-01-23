<script lang="ts">
    import { loggedUserStore } from "../stores/loggedUser.store";
  
    let cover_file: File | null = null;
    let profile_file: File | null = null;
  
    function coverFileInput(event: Event) {
      const files = (event.target as HTMLInputElement).files;
      cover_file = files ? files[0] : null;
      
      if (cover_file != null) {
        console.log('Cover File:');
        console.log(cover_file);
      }
    }
  
    function profileFileInput(event: Event) {
      const files = (event.target as HTMLInputElement).files;
      profile_file = files ? files[0] : null;
  
      if (profile_file != null) {
        console.log('Profile File:');
        console.log(profile_file);
      }
    }
  
    async function updateUserProfile() {
      const formData: FormData = new FormData();
      formData.append('user_id', $loggedUserStore.user_id.toString());
  
      // Optional chaining to check if cover_file is defined before appending
      cover_file?.size && formData.append('cover_file', cover_file);
  
      // Optional chaining to check if profile_file is defined before appending
      profile_file?.size && formData.append('profile_file', profile_file);
  
      console.log('Cover File (before fetch):');
      console.log(cover_file);
  
      console.log('Profile File (before fetch):');
      console.log(profile_file);
  
      await fetch('https://seal-app-bx8q5.ondigitalocean.app/user/updateUserProfile', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Response:');
          console.log(data);
          $loggedUserStore.profile_file = new Uint8Array(data.profile_file);
          $loggedUserStore.profile_file = new Uint8Array(data.cover_file);
          console.log('====================================');
          console.log($loggedUserStore.profile_file);
          console.log('====================================');
          console.log($loggedUserStore.cover_file);
        });
    }
  </script>
  
  <div class="flex items-center justify-center min-h-screen bg-gray-200">
    <form on:submit|preventDefault={updateUserProfile} class="fixed flex items-center justify-center w-1/2 h-1/2 bg-strongpink rounded-xl" enctype="multipart/form-data" method="post">
      <div>
        <label for="">Ažuriraj pozadinsku sliku</label>
        <input type="file" name="cover_file" on:change={(e) => coverFileInput(e)}>
      </div>
      <div>
        <label for="">Ažuriraj profilnu sliku</label>
        <input type="file" name="profile_file" on:change={(e) => profileFileInput(e)}>
      </div>
      <button type="submit">Spremi</button>
    </form>
  </div>
  
