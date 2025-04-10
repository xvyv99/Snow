<script lang='ts'>
    let selected: string = 'landscape';  

    function selectDiv(index: string) {
        selected = index; 
    }

    import { goto } from '$app/navigation';

    function navigate() {
      const selectedParam = new URLSearchParams({ selected })
      goto(`/custom?${selectedParam}`);
    }

    import ContainedSnowfall from '$lib/snowflake.svelte';

</script>

<style>

    .bd {
      display: grid;
      grid-template-rows: 7fr 2fr 1fr; 
      width: 100%; height: 100dvh;
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
      padding-top: 20px;
      width: 100%;
      height: 100%;
      box-shadow: 0 6px 18px rgba(80, 160, 210, 0.2);
      position: relative;
      overflow: hidden;
      }

    @font-face {
      font-family: 'CustomFont';
      font-style: normal;
      font-weight: normal;
      src: url('/fonts/zt.woff') format('woff');
    }

    .art_text {
      font-family: 'CustomFont';
    }

    #mainSentence {
      margin-top: 20%;
      font-size: 30px;
      cursor: pointer;
    }

    #dt {
      position: relative;
      top: 50px;
    }

    /* 内容区域 - 确保显示在雪花上方 */
    .content {
      position: relative;
      z-index: 2;
      padding-left: 20px;
      padding-right: 20px;
      height: 100%;
      user-select: none;
    }

     .hv {
       transition: all 0.3s ease;
       cursor: pointer;
       text-align: center;
       user-select: none;
       z-index: 1;
     }

    .hv.active {
      transform: scale(1.3);
      /* 放大时稍微上移，避免遮挡下方内容 */
      transform-origin: bottom center;
    }

    .hv.inactive {
      transform: scale(0.9);
      opacity: 0.7;
    }

    .hv.active p {
      font-weight: bold; /* 放大时文字加粗 */
    }

</style>

<svelte:head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>冰趣卡</title>
</svelte:head>

<div class="bd">
  <div class="snow-container">
    <ContainedSnowfall snowflakeCount={20} minSize={10} maxSize={20}>
    <div class="content">
      <h1 class='art_text' style="width: 100%;text-align: center">冰趣卡</h1>
      <div id="mainSentence" style="display: flex;flex-direction: column;justify-content: center;align-items: center">
        <div class='art_text'>点击开启</div>
        <div class='art_text'>您的专属定制</div>
      </div>
      <div style="height: 200px;margin-top: 15%;display: flex;flex-direction: row;align-items: flex-end">
        <div style="border: 4px solid white;width: 450px;height: 200px;display: flex;align-items: flex-end; border-radius: 10px;" class="card">
          <div id="dt" style="width: 300px;display: flex;flex-direction: row;justify-content: space-around;align-items: flex-end">
            <button class="hv" class:active={selected === 'culture'} class:inactive={selected != 'culture'} on:click={() => selectDiv('culture')} style="border: none; background: none;">
              <img src="/culture.jpg" alt="" width="60" height="100">
              <p class='art_text' style="margin: 0;text-align: center">文化主题</p>
            </button>
            <button class="hv" class:active={selected === 'landscape'} class:inactive={selected != 'landscape'} on:click={() => selectDiv('landscape')} style="border: none; background: none;">
              <img src="/landscape.jpg" alt="" width="60" height="100">
              <p class='art_text' style="margin: 0;text-align: center">风景主题</p>
            </button>
            <button class="hv" class:active={selected === 'folk'} class:inactive={selected != 'folk'} on:click={() => selectDiv('folk')} style="border: none; background: none;">
              <img src="/folk.jpg" alt="" width="60" height="100">
              <p class='art_text' style="margin: 0;text-align: center">名俗主题</p>
            </button>
          </div>
        </div>
        <div><img src="/snowman.png" alt="" width="150" height="200" style="position: relative;right: 50px; bottom: 25px"></div>
      </div>
    </div>
  </ContainedSnowfall>
  </div>

<div>
  <div style="margin-top: 15%">
    <div style="display: flex;flex-direction: row;justify-content: space-around;">
      <div class='art_text'>定制流程</div>

    </div>
  </div>
  <div style="margin-top: 15px">
    <div style="display: flex;flex-direction: row;justify-content: space-around;">
      <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">
        <div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="1" stroke="#1890ff" stroke-width="2"/>
            <path d="M4 8H20M8 4V8M12 4V8M16 4V8" stroke="#1890ff" stroke-width="2"/>
            <circle cx="12" cy="14" r="2" fill="#1890ff"/>
          </svg>
        </div>
        <div class='art_text'>
          选定模板
        </div>
      </div>
      <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">
        <div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3V21M3 12H21" stroke="#52c41a" stroke-width="2" stroke-linecap="round"/>
            <path d="M18 6L6 18M6 6L18 18" stroke="#52c41a" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="12" r="3" stroke="#52c41a" stroke-width="2"/>
          </svg>
        </div>
        <div class='art_text'>
          个性化定制
        </div>
      </div>
      <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">
        <div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5H5.5L8 16H18M8 16L6.5 9.5M18 16H21L18.5 9.5H8" stroke="#faad14" stroke-width="2" stroke-linecap="round"/>
            <circle cx="9" cy="19" r="1" fill="#faad14"/>
            <circle cx="18" cy="19" r="1" fill="#faad14"/>
            <path d="M9 9H12" stroke="#faad14" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class='art_text'>
          提交订单
        </div>
      </div>
      <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">
        <div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="8" width="16" height="10" rx="1" stroke="#722ed1" stroke-width="2"/>
            <path d="M18 8H22V14H18M18 14H14V18M18 14V18H22" stroke="#722ed1" stroke-width="2"/>
            <circle cx="7" cy="18" r="2" stroke="#722ed1" stroke-width="2"/>
            <circle cx="19" cy="18" r="2" stroke="#722ed1" stroke-width="2"/>
            <path d="M10 8H14" stroke="#722ed1" stroke-width="2"/>
          </svg>
        </div>
        <div class='art_text'>
          发货收货
        </div>
      </div>
    </div>
  </div>
</div>

  <div style="display: flex;justify-content: center;margin-top: 10px">
    <button on:click={navigate} style="margin-top: 20px; font-family: 'CustomFont';color: white;font-size: larger;border:#ff1f1f;background-color: #ff2121;border-radius: 20px;width: 80%;height: 50px">
     点击定制
    </button>
  </div>
</div>

