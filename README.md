# RenderTools
---
  
### Updated 10.16  
The first goal on the TODO list has been accomplished.  
- Fill the depth/stencil attachment and set it as input attachment in the first subpass  
- Read the input attachment in the second subpass.  
I will upload the code after I fix the blurry panel.  

![image](https://github.com/AlbertHuang96/VkRendererTools/blob/main/images/debugoverdraw3.png)


This project is based on Sascha Willems's demo framework which is in the base directory.  
   
![image](https://github.com/AlbertHuang96/VkRendererTools/blob/main/images/debugoverdraw2.png)

#### Debug overdraw
Rendering scene with multiple lights may lead to severe overdraw problems in **forward rendering**.   
To count the number of times that fragment shader shade a pixel when rendering the scene,   
setting up stencil test for the Sponza scene rendering pipeline as the following:   
```
depthStencilStateCI.stencilTestEnable = VK_TRUE;
depthStencilStateCI.front.compareOp = VK_COMPARE_OP_ALWAYS;
depthStencilStateCI.front.compareMask = 0xff;
depthStencilStateCI.front.writeMask = 0xff;
depthStencilStateCI.front.depthFailOp = VK_STENCIL_OP_INCREMENT_AND_CLAMP;
depthStencilStateCI.front.passOp = VK_STENCIL_OP_INCREMENT_AND_CLAMP;
```
#### TODOs
- Visualize different stencil values on the screen
- Use the same renderpass when rendering shadow map?

![image](https://github.com/AlbertHuang96/VkRendererTools/blob/main/images/debugoverdraw.png)

#### ZPrepass
To investigate the methods to reduce overdraw,   
enabling the early fragment test in the scene rendering fragment shader by    
```
layout (early_fragment_tests) in;
```
Add a depth prepass as well before scene rendering with an empty fragment shader to fill the depth buffer.
By turning the prepass on, the framerate gets increased stably to 180-190fps as shown in the screenshot.   


![image](https://github.com/AlbertHuang96/VkRendererTools/blob/main/images/180-190fps.png)

#### Notice 
You can select your GPU in the line 1022 by modifying the code in ***.\base\vulkanexamplebase.cpp***. 
```
        ...
1022    uint32_t selectedDevice  = 1;
        ...
```
The variable ***selectedDevice*** is 1 for default. You can change it to 0 in case:
- `You want to switch to another GPU` 
- `You only have only one GPU and the program crashes at the GPU selection.`
 

