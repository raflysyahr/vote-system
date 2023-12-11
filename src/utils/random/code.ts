export default function code(length:number){
  let result = '';
  const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charLength = char.length;

  for(let i = 0 ; i < length;i++){
      result += char.charAt(Math.floor(Math.random() * charLength));
  }

  return result

}
