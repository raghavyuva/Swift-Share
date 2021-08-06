<script>
  import FileUpload from "./components/File.svelte";
  import StaticHero from "./components/StaticHero.svelte";
</script>


<div class=" bg-gray-500 h-screen bg-gradient-to-r from-yellow-400 via-blue-500 to-pink-500 bg-cover"
style="background-image: url(https://freellustrustrations.s3.us-east-2.amazonaws.com/free-images/thumbimg_15199595thumbejpg.jpg); background-repeat: no-repeat; "
>
  <div class='md:p-10  p-2 md:text-justify'>
    <span
    class='text-2xl font-serif text-white font-bold bg-gray-900 p-2  text-center  '
    >Swift Share</span>
    <div class=" lg:flex lg:flex-row  items-center justify-center pt-10">
      <StaticHero />
      <FileUpload />
    </div>
  </div>
</div>


<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
