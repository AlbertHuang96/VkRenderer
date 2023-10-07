#version 450

layout (early_fragment_tests) in;

layout (set = 0, binding = 1) uniform sampler2D shadowMap;
layout (set = 0, binding = 2) uniform sampler2D shadowMap2;

layout (set = 0, binding = 0) uniform UBO 
{
	mat4 projection;
	mat4 view;
	mat4 model;
	mat4 lightSpace[2];
	vec3 lightPos[2];
} ubo;

layout (set = 1, binding = 0) uniform sampler2D colorMap;

layout (location = 0) in vec3 inNormal;
layout (location = 1) in vec3 inColor;
layout (location = 2) in vec3 inViewVec;
layout (location = 3) in vec3 inWorld;
layout (location = 4) in vec4 inShadowCoord;
layout (location = 5) in vec4 inShadowCoord2;
layout (location = 6) in vec2 inUV;

layout (constant_id = 0) const int enablePCF = 0;

layout (location = 0) out vec4 outFragColor;

#define ambient 0.1

float textureProj(vec4 shadowCoord, vec2 off)
{
	float shadow = 1.0;
	if ( shadowCoord.z > -1.0 && shadowCoord.z < 1.0 ) 
	{
		float dist = texture( shadowMap, shadowCoord.st + off ).r;
		if ( shadowCoord.w > 0.0 && dist < shadowCoord.z ) 
		{
			shadow = ambient;
		}
	}
	return shadow;
}

float filterPCF(vec4 sc)
{
	ivec2 texDim = textureSize(shadowMap, 0);
	float scale = 1.5;
	float dx = scale * 1.0 / float(texDim.x);
	float dy = scale * 1.0 / float(texDim.y);

	float shadowFactor = 0.0;
	int count = 0;
	int range = 1;
	
	for (int x = -range; x <= range; x++)
	{
		for (int y = -range; y <= range; y++)
		{
			shadowFactor += textureProj(sc, vec2(dx*x, dy*y));
			count++;
		}
	
	}
	return shadowFactor / count;
}

float textureProj2(vec4 shadowCoord, vec2 off)
{
	float shadow = 1.0;
	if ( shadowCoord.z > -1.0 && shadowCoord.z < 1.0 ) 
	{
		float dist = texture( shadowMap2, shadowCoord.st + off ).r;
		if ( shadowCoord.w > 0.0 && dist < shadowCoord.z ) 
		{
			shadow = ambient;
		}
	}
	return shadow;
}

float filterPCF2(vec4 sc)
{
	ivec2 texDim = textureSize(shadowMap2, 0);
	float scale = 1.5;
	float dx = scale * 1.0 / float(texDim.x);
	float dy = scale * 1.0 / float(texDim.y);

	float shadowFactor = 0.0;
	int count = 0;
	int range = 1;
	
	for (int x = -range; x <= range; x++)
	{
		for (int y = -range; y <= range; y++)
		{
			shadowFactor += textureProj2(sc, vec2(dx*x, dy*y));
			count++;
		}
	
	}
	return shadowFactor / count;
}

void main() 
{	
	float shadow = (enablePCF == 1) ? filterPCF(inShadowCoord / inShadowCoord.w) : textureProj(inShadowCoord / inShadowCoord.w, vec2(0.0));
    float shadow2 = (enablePCF == 1) ? filterPCF2(inShadowCoord2 / inShadowCoord2.w) : textureProj2(inShadowCoord2 / inShadowCoord2.w, vec2(0.0));
	vec3 N = normalize(inNormal);
	vec3 color = texture(colorMap, inUV).rgb;
	vec3 lighting = color * 0.1f;

	// vec3 L = normalize(ubo.lightPos[0] - inWorld);
	// vec3 R = normalize(-reflect(L, N));
	// vec3 diffuse = max(dot(N, L), ambient) * color;
	// lighting += diffuse;

	// for (int i = 0; i < 2; i++)
	// {
	// 	vec3 L = normalize(ubo.lightPos[i] - inWorld);
	// 	vec3 diffuse = max(dot(N, L), ambient) * color;
	// 	lighting += diffuse;
	// }

	vec3 L = normalize(ubo.lightPos[0] - inWorld);
	vec3 diffuse = max(dot(N, L), ambient) * color;
	lighting += diffuse * shadow;

	L = normalize(ubo.lightPos[1] - inWorld);
	diffuse = max(dot(N, L), ambient) * color;
	lighting += diffuse * shadow2;

	outFragColor = vec4(lighting, 1.0);

}
