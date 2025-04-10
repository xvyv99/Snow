<script lang="ts">
    import ContainedSnowfall from '$lib/snowflake.svelte';
	  import Canvas from '$lib/canvas.svelte'
	  import Palette from '$lib/palette.svelte'

    export let data;
    let selected = data.props.data['selected'];
</script>

<svelte:head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>个性化定制</title>
</svelte:head>

  <style>
    #bd {
      width: 100%;
      height: 100lvh;
      margin: 0 auto;
      position: relative;
      overflow: hidden;
    }

    .snow-container {
      /* 更深的冰蓝色背景 */
      background-color: #d0e9f5;
      /* 微妙的渐变，增强层次感 */
      background-image: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.4) 0%,
              rgba(208, 233, 245, 0.8) 50%,
              rgba(176, 216, 235, 0.9) 100%
      );
      /* 卡片基础样式 */
      height: 100dvh;
      box-shadow: 0 6px 18px rgba(80, 160, 210, 0.2);
      position: relative;
      overflow: hidden;
    }

    body {
      font-family: 'CustomFont';
    }

    #mainSentence img {
      font-size: 30px;
    }


    /* 内容区域 - 确保显示在雪花上方 */
    .content {
      position: relative;
      z-index: 2;
      padding-left: 20px;
      padding-right: 20px;
      height: 100%;
    }
    .inner>div{
      margin-right: 10px;
    }

    .card-container {
      width: 100%;
      max-width: 800px; /* 最大宽度 */
      aspect-ratio: 9 / 16;
      border: 3px solid white;
      width: 60%;
      margin: 100px auto 0;
      border-radius: 20px;
      overflow: hidden;
    }

    .card-container img {
      max-width: 100%; /* 保证图片宽度不超出容器 */
      max-height: 100%; /* 保证图片高度不超出容器 */
      object-fit: cover; /* 保持图片比例 */
    }

    .op-button {
        font-size: 20px;
        border: none; 
        background: none;
    }
  </style>


<div id="bd">
  <div class="snow-container">
    <ContainedSnowfall snowflakeCount={20} minSize={10} maxSize={20}>
        <div class='card-container'>
          <Canvas />
        </div>
        <div style="position: relative;display: flex;justify-content: right;bottom: 60px;right: 40px">
          <img src="/snowman.png" alt="" width="100" height="150">
        </div>
        <div style="width: 380px;margin: 0 auto;position: relative;display: flex;justify-content: space-between;bottom: 60px;">
          <div class="inner" style="display: flex;flex-direction: row; gap: 10px;">
            <button class="op-button">🖼️图片</button>
            <button class="op-button">📝文字</button>
            <button class="op-button">🎟️贴纸</button>
          </div>
          <div class="inner" style="display: flex;flex-direction: row">
            <div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
             <path d="M12 5V1L4 8L12 15V11C16.42 11 19.5 12.5 22 16C21 11 17 5 12 5Z"
                   fill="currentColor"/>
           </svg>
            </div>
                <div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
             <path d="M12 5V1L20 8L12 15V11C7.58 11 4.5 12.5 2 16C3 11 7 5 12 5Z"
                   fill="currentColor"/>
                </svg>           
            </div>
          </div>
        </div>
        <div style="display: flex;justify-content: center;margin-top: 10px">
            <button style="margin-top: 20px; font-family: 'CustomFont';color: white;font-size: larger;border:#ff1f1f;background-color: #ff2121;border-radius: 20px;width: 80%;height: 50px">
             提交
            </button>
          </div>
    </ContainedSnowfall>
    
  </div>

</div>