# Assets

This folder contains all raw sprite assets as single images.
This will be packed together by using the `npm run bundle-assets` script (one directory up).
To add a new asset add it here as a png and create a `<filename>.json` file as well.
E.G knight.png will have a knight.json file as well.

## Json file format
The json file format helps define the sprite, with things like origin and a id of the sprite.
format
```
{
    "id":"mysupersprite",
    "origin": {
        x: 32,
        y: 27
    }
}
```

## Bundle assets

To bundle assets run `npm run bundle-assets` this will
- Load all files and json info for each file
- Generate a single spritesheet for all assets
- Concatinate json data
- Write a generated typescript file containing contatinated json data and position data for where in the spritesheet the asset is located
