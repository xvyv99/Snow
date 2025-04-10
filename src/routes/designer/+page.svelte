<script lang="ts">
    import { onMount } from 'svelte';
    import ContainedSnowfall from '$lib/snowflake.svelte';
    import Palette from '$lib/palette.svelte';

    let canvas: any;
    let canvasContainer: HTMLDivElement;
    let showPalette = false;
    let showTextPalette = false;
    let currentColor = '#333';
    let currentTextColor = '#333';
    let showTextInput = false;
    let textInput = '';
    let isDrawing = false;
    let brushSize = 5;
    let showEmojiPicker = false;
    const emojis = ['😀', '😂', '🥰', '😎', '🤔', '😴', '🥳', '😍', '🤗', '😇', '🎉', '✨', '🌟', '💫', '💝', '💖'];
    let showImageUpload = false;
    let imageInput: HTMLInputElement;
    let backgroundInput: HTMLInputElement;
    let showBackgroundUpload = false;
    
    // 添加历史记录相关变量
    let history: string[] = [];
    let currentStep = -1;
    const maxHistorySteps = 50;

    onMount(() => {
        // 初始化 Fabric.js canvas
        canvas = new (window as any).fabric.Canvas('fabric-canvas', {
            width: canvasContainer.clientWidth,
            height: canvasContainer.clientHeight,
            backgroundColor: '#ffffff',
            isDrawingMode: false
        });

        // 设置画笔属性
        canvas.freeDrawingBrush.width = brushSize;
        canvas.freeDrawingBrush.color = currentColor;

        // 加载背景图片
        const img = new Image();
        img.onload = () => {
            const fabricImage = new (window as any).fabric.Image(img, {
                width: canvas.width,
                height: canvas.height,
                selectable: false,
                evented: false
            });
            
            canvas.setBackgroundImage(fabricImage, canvas.renderAll.bind(canvas), {
                scaleX: canvas.width! / img.width,
                scaleY: canvas.height! / img.height
            });
        };
        img.src = '/background.jpg'; // 替换为您的背景图片路径

        // 监听窗口大小变化
        window.addEventListener('resize', handleResize);

        // 监听鼠标事件
        canvas.on('mouse:down', startDrawing);
        canvas.on('mouse:move', drawing);
        canvas.on('mouse:up', stopDrawing);
        
        // 监听画布变化
        canvas.on('object:added', saveState);
        canvas.on('object:modified', saveState);
        canvas.on('object:removed', saveState);
        
        // 保存初始状态
        saveState();
    });

    // 保存画布状态
    function saveState() {
        const json = canvas.toJSON();
        const state = JSON.stringify(json);
        
        // 如果当前不在最新状态，删除当前状态之后的所有历史
        if (currentStep < history.length - 1) {
            history = history.slice(0, currentStep + 1);
        }
        
        // 添加新状态
        history.push(state);
        currentStep++;
        
        // 限制历史记录数量
        if (history.length > maxHistorySteps) {
            history.shift();
            currentStep--;
        }
    }

    // 撤回操作
    function undo() {
        if (currentStep > 0) {
            currentStep--;
            loadState(history[currentStep]);
        }
    }

    // 重做操作
    function redo() {
        if (currentStep < history.length - 1) {
            currentStep++;
            loadState(history[currentStep]);
        }
    }

    // 加载画布状态
    function loadState(state: string) {
        canvas.loadFromJSON(state, () => {
            canvas.renderAll();
        });
    }

    function startDrawing(e: any) {
        if (!isDrawing) return;
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = currentColor;
        canvas.freeDrawingBrush.width = brushSize;
    }

    function drawing(e: any) {
        if (!isDrawing) return;
        canvas.isDrawingMode = true;
    }

    function stopDrawing() {
        canvas.isDrawingMode = false;
        isDrawing = false;
    }

    function handleResize() {
        if (canvas && canvasContainer) {
            canvas.setWidth(canvasContainer.clientWidth);
            canvas.setHeight(canvasContainer.clientHeight);
            canvas.renderAll();
        }
    }

    function handleColorSelect(event: CustomEvent) {
        currentColor = event.detail.color;
        showPalette = false;
        
        // 更新画笔颜色
        canvas.freeDrawingBrush.color = currentColor;
        
        // 更新选中对象的颜色
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            if (activeObject.type === 'text') {
                activeObject.set('fill', currentTextColor);
            } else {
                activeObject.set('stroke', currentColor);
            }
            canvas.renderAll();
        }
    }

    function handleTextColorSelect(event: CustomEvent) {
        currentTextColor = event.detail.color;
        showTextPalette = false;
        
        // 更新选中文本的颜色
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.type === 'text') {
            activeObject.set('fill', currentTextColor);
            canvas.renderAll();
        }
    }

    function addText() {
        if (!textInput.trim()) return;
        
        const text = new (window as any).fabric.Text(textInput, {
            left: canvas.width! / 2,
            top: canvas.height! / 2,
            fontFamily: 'CustomFont',
            fontSize: 24,
            fill: currentTextColor,
            originX: 'center',
            originY: 'center'
        });
        
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
        
        textInput = '';
        showTextInput = false;
        showTextPalette = false;
    }

    function handleSave() {
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1
        });
        
        const link = document.createElement('a');
        link.download = 'design.png';
        link.href = dataURL;
        link.click();
    }

    function toggleDrawing() {
        isDrawing = !isDrawing;
        canvas.isDrawingMode = isDrawing;
        if (isDrawing) {
            canvas.freeDrawingBrush.color = currentColor;
            canvas.freeDrawingBrush.width = brushSize;
        }
    }

    function handleBrushSize(event: Event) {
        const input = event.target as HTMLInputElement;
        brushSize = parseInt(input.value);
        canvas.freeDrawingBrush.width = brushSize;
    }

    function addEmoji(emoji: string) {
        const text = new (window as any).fabric.Text(emoji, {
            left: canvas.width! / 2,
            top: canvas.height! / 2,
            fontFamily: 'Arial',
            fontSize: 40,
            fill: currentColor,
            originX: 'center',
            originY: 'center'
        });
        
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
        
        showEmojiPicker = false;
    }

    function handleImageUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const fabricImage = new (window as any).fabric.Image(img, {
                    left: canvas.width! / 2,
                    top: canvas.height! / 2,
                    originX: 'center',
                    originY: 'center'
                });
                
                canvas.add(fabricImage);
                canvas.setActiveObject(fabricImage);
                canvas.renderAll();
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
        
        showImageUpload = false;
    }

    // 设置背景图片
    function setBackgroundImage(file: File) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const fabricImage = new (window as any).fabric.Image(img, {
                    width: canvas.width,
                    height: canvas.height,
                    selectable: false,
                    evented: false
                });
                
                canvas.setBackgroundImage(fabricImage, canvas.renderAll.bind(canvas), {
                    scaleX: canvas.width! / img.width,
                    scaleY: canvas.height! / img.height
                });
                
                saveState();
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }

    function handleBackgroundUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;
        
        setBackgroundImage(file);
        showBackgroundUpload = false;
    }
</script>

<svelte:head>
    <title>设计</title>
    <script src="https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/fabric.js/521/fabric.min.js"></script>
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
        background-color: #d0e9f5;
        background-image: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.4) 0%,
            rgba(208, 233, 245, 0.8) 50%,
            rgba(176, 216, 235, 0.9) 100%
        );
        height: 100dvh;
        box-shadow: 0 6px 18px rgba(80, 160, 210, 0.2);
        position: relative;
        overflow: hidden;
    }

    .card-container {
        width: 100%;
        max-width: 800px;
        aspect-ratio: 9 / 16;
        border: 3px solid white;
        width: 60%;
        margin: 100px auto 0;
        border-radius: 20px;
        overflow: hidden;
        background: white;
    }

    .op-button {
        font-size: 15px;
        border: none;
        background: none;
        font-family: 'CustomFont';
        cursor: pointer;
    }

    .palette-container {
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        background: white;
        padding: 20px;
        border-radius: 20px 0 0 20px;
        box-shadow: -2px 0 10px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
        z-index: 1000;
    }

    .palette-container.hidden {
        transform: translate(100%, -50%);
    }

    .text-input-container {
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        background: white;
        padding: 20px;
        border-radius: 20px 0 0 20px;
        box-shadow: -2px 0 10px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .text-input-container input {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: 'CustomFont';
    }

    .text-input-container button {
        padding: 8px;
        background: #4fa9cc;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: 'CustomFont';
    }

    .text-input-container button:hover {
        background: #3f8d27;
    }

    .text-palette {
        right: 200px;
    }

    .color-button {
        padding: 8px;
        background: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        font-family: 'CustomFont';
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .color-button:hover {
        background: #e0e0e0;
    }

    .brush-size-container {
        display: flex;
        align-items: center;
        gap: 10px;
        background: white;
        padding: 5px 10px;
        border-radius: 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .brush-size-container input[type="range"] {
        width: 100px;
    }

    .brush-size-container span {
        font-family: 'CustomFont';
        color: #333;
    }

    .emoji-picker {
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        background: white;
        padding: 20px;
        border-radius: 20px 0 0 20px;
        box-shadow: -2px 0 10px rgba(0,0,0,0.1);
        z-index: 1000;
    }

    .emoji-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
    }

    .emoji-button {
        width: 40px;
        height: 40px;
        font-size: 24px;
        border: none;
        background: none;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: background-color 0.2s;
    }

    .emoji-button:hover {
        background-color: #f0f0f0;
    }

    .image-upload-container {
        position: fixed;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        background: white;
        padding: 20px;
        border-radius: 20px 0 0 20px;
        box-shadow: -2px 0 10px rgba(0,0,0,0.1);
        z-index: 1000;
    }

    .upload-button {
        padding: 10px 20px;
        background: #4fa9cc;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: 'CustomFont';
    }

    .upload-button:hover {
        background: #3f8d27;
    }
</style>

<div id="bd">
    <div class="snow-container">
        <ContainedSnowfall snowflakeCount={20} minSize={10} maxSize={20}>
            <div class='card-container' bind:this={canvasContainer}>
                <canvas id="fabric-canvas"></canvas>
            </div>
            <div style="position: relative;display: flex;justify-content: right;bottom: 60px;right: 40px">
                <img src="/snowman.png" alt="" width="100" height="150">
            </div>
            <div style="width: 380px;margin: 0 auto;position: relative;display: flex;justify-content: space-between;bottom: 60px;">
                <div class="inner" style="display: flex;flex-direction: row; gap: 7px;">
                    <button class="op-button" on:click={() => {
                        showBackgroundUpload = !showBackgroundUpload;
                        if (showBackgroundUpload) {
                            showImageUpload = false;
                            showTextInput = false;
                            showEmojiPicker = false;
                            showPalette = false;
                            isDrawing = false;
                        }
                    }}>🖼️ 背景</button>
                    <button class="op-button" on:click={() => {
                        showImageUpload = !showImageUpload;
                        if (showImageUpload) {
                            showBackgroundUpload = false;
                            showTextInput = false;
                            showEmojiPicker = false;
                            showPalette = false;
                            isDrawing = false;
                        }
                    }}>🖼️ 图片</button>
                    <button class="op-button" on:click={() => {
                        showTextInput = !showTextInput;
                        if (showTextInput) {
                            showImageUpload = false;
                            showEmojiPicker = false;
                            showPalette = false;
                            isDrawing = false;
                        }
                    }}>📝 文字</button>
                    <button class="op-button" on:click={() => {
                        showEmojiPicker = !showEmojiPicker;
                        if (showEmojiPicker) {
                            showImageUpload = false;
                            showTextInput = false;
                            showPalette = false;
                            isDrawing = false;
                        }
                    }}>🎟️ 贴纸</button>
                    <button class="op-button" on:click={toggleDrawing} on:click={() => {
                        showPalette = !showPalette;
                        isDrawing = !isDrawing;
                        if (showPalette) {
                            showImageUpload = false;
                            showTextInput = false;
                            showEmojiPicker = false;
                        }
                    }}>🎨 画笔</button>
                </div>
                <div class="inner" style="display: flex;flex-direction: row; align-items: center; gap: 10px;">
                    <button class="op-button" on:click={undo} style="cursor: pointer; opacity: {currentStep <= 0 ? '0.5' : '1'}" aria-label="撤回">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V1L4 8L12 15V11C16.42 11 19.5 12.5 22 16C21 11 17 5 12 5Z"
                                fill="currentColor" />
                        </svg>
                    </button>
                    <button class="op-button" on:click={redo} style="cursor: pointer; opacity: {currentStep >= history.length - 1 ? '0.5' : '1'}" aria-label="重做">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5V1L20 8L12 15V11C7.58 11 4.5 12.5 2 16C3 11 7 5 12 5Z"
                                fill="currentColor" />
                        </svg>
                    </button>
                </div>
            </div>
            <div style="display: flex;justify-content: center;margin-top: 10px">
                <button on:click={handleSave}
                    style="margin-top: 20px; font-family: 'CustomFont';color: white;font-size: larger;border:#ff1f1f;background-color: #ff2121;border-radius: 20px;width: 80%;height: 50px">
                    提交
                </button>
            </div>
        </ContainedSnowfall>
    </div>
</div>

{#if showPalette}
    <div class="palette-container" class:hidden={!showPalette}>
        <Palette on:color={handleColorSelect} paletteColor={currentColor} />
        <div class="brush-size-container">
            <input type="range" min="1" max="20" value={brushSize} on:input={handleBrushSize} />
            <span>{brushSize}px</span>
        </div>
    </div>
{/if}

{#if showTextInput}
    <div class="text-input-container">
        <input type="text" bind:value={textInput} placeholder="输入文字"
            on:keydown={(e) => e.key === 'Enter' && addText()} />
        <button class="color-button" on:click={() => showTextPalette = !showTextPalette}>
            文字颜色: <span style="color: {currentTextColor}">■</span>
        </button>
        <button on:click={addText}>添加</button>
    </div>
{/if}

{#if showTextPalette}
    <div class="palette-container text-palette">
        <Palette on:color={handleTextColorSelect} paletteColor={currentTextColor}/>
    </div>
{/if}

{#if showEmojiPicker}
    <div class="emoji-picker">
        <div class="emoji-grid">
            {#each emojis as emoji}
                <button class="emoji-button" on:click={() => addEmoji(emoji)}>{emoji}</button>
            {/each}
        </div>
    </div>
{/if}

{#if showImageUpload}
    <div class="image-upload-container">
        <input type="file" accept="image/*" on:change={handleImageUpload} bind:this={imageInput} style="display: none" />
        <button class="upload-button" on:click={() => imageInput.click()}>
            选择图片
        </button>
    </div>
{/if}

{#if showBackgroundUpload}
    <div class="image-upload-container">
        <input type="file" accept="image/*" on:change={handleBackgroundUpload} bind:this={backgroundInput} style="display: none" />
        <button class="upload-button" on:click={() => backgroundInput.click()}>
            选择背景图片
        </button>
    </div>
{/if}