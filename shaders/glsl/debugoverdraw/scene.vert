#version 450

layout (location = 0) in vec3 inPos;
layout (location = 1) in vec2 inUV;
layout (location = 2) in vec3 inColor;
layout (location = 3) in vec3 inNormal;

layout (set = 0, binding = 0) uniform UBO 
{
	mat4 projection;
	mat4 view;
	mat4 model;
	mat4 lightSpace[2];
	vec3 lightPos[2];
} ubo;

layout (location = 0) out vec3 outNormal;
layout (location = 1) out vec3 outColor;
layout (location = 2) out vec3 outViewVec;
//layout (location = 3) out vec3 outLightVec;
layout (location = 3) out vec3 outWorld;
layout (location = 4) out vec4 outShadowCoord;
layout (location = 5) out vec4 outShadowCoord2;
layout (location = 6) out vec2 outUV;

out gl_PerVertex 
{
    vec4 gl_Position;   
};

const mat4 biasMat = mat4( 
	0.5, 0.0, 0.0, 0.0,
	0.0, 0.5, 0.0, 0.0,
	0.0, 0.0, 1.0, 0.0,
	0.5, 0.5, 0.0, 1.0 );

void main() 
{
	outColor = inColor;
	outNormal = inNormal;

	gl_Position = ubo.projection * ubo.view * ubo.model * vec4(inPos.xyz, 1.0);
	
    vec4 pos = ubo.model * vec4(inPos, 1.0);
    outNormal = mat3(ubo.model) * inNormal;
    //outLightVec = normalize(ubo.lightPos - inPos);
    outViewVec = -pos.xyz;
	
	outWorld = pos.xyz;
	outUV = inUV;

	outShadowCoord = ( biasMat * ubo.lightSpace[0] * ubo.model ) * vec4(inPos, 1.0);
	outShadowCoord2 = ( biasMat * ubo.lightSpace[1] * ubo.model ) * vec4(inPos, 1.0);
}

