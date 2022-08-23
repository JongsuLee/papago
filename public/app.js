const textAreaArray = document.getElementsByClassName('Card__body__content');

// 변수 네이밍 컨벤션: 도메인과 관련된 용어를 미리 정의
// source: 번역할 텍스트와 관련된 명칭('안녕하세요'를 변역한다면, resource='안녕하세요')
// target: 번역된 결과와 관련된 명칭

const [sourceTextArea, targetTextArea] = textAreaArray;
const [sourceSelect, targetSelect] = document.getElementsByClassName('form-select');
console.dir(targetSelect);
// 번역하고자 하는 언어의 타입
let targetLanguage = 'en';

// 어떤 언어로 번역할지 선택하는 target selectbox의 선택지의 값이 바뀔때 마다 이벤트를 발생하도록, 지정한 언어의 타입 값을 targetLanguage 변수에 할당
// 이벤트 ==> change, selectBox 객체가 갖고 있는 프로퍼티를 활용
targetSelect.addEventListener('change', () => { const targetValue = targetSelect.value
                                                targetLanguage = targetValue});

// 번역할 문장 입력시 source 변수에 해당 문장을 할당
// let source = '';
// sourceTextArea.addEventListener('keyup', () => { const content = sourceTextArea.value;
//                                                  source = content;
//                                                  console.log(source);})

let debouncer;
sourceTextArea.addEventListener('input', (event) => { if (debouncer) {
                                                        clearTimeout(debouncer)
                                                      };
                                                      debouncer = setTimeout(() => {const text = event.target.value;
                                                                                    const xhr = new XMLHttpRequest();
                                                                                    const url = '/detectLangs'; // node 서버의 특정 url 주소
                                                                                    
                                                                                    xhr.onreadystatechange = () => {
                                                                                      if (xhr.readyState === 4 && xhr.status === 200) {
                                                                                        // 최종적으로 papago가 번역해준 번역된 텍스트 결과를 받는 부분
                                                                                        const parsedData = JSON.parse(xhr.responseText);
                                                                                        const result = parsedData.message.result;
                                                                                        targetTextArea.value = result.translatedText;
                                                                                        console.log(parsedData);

                                                                                        const options = sourceSelect.options;
                                                                                        for (let i = 0; i < options.length; i++) {
                                                                                          if (options[i].value === result.srcLangType) {
                                                                                            sourceSelect.selectedIndex = i;
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    };
                                                                                    // 요청 준비
                                                                                    xhr.open('POST', url);
                                                                                    
                                                                                    // 요청을 보낼 때, 동봉할 객체(object)
                                                                                    const requestData = {
                                                                                      text, // text: text // 프로퍼티와 변수명이 같을 때, 한 개만 작성해도됨
                                                                                      targetLanguage, // targetLanguage: targetLanguage
                                                                                    };
                                                                                  
                                                                                    // 클라이언트가 서버에게 보내는 요청 데이터의 형식이 json임을 명시
                                                                                    xhr.setRequestHeader('Content-type', 'application/json') // text/html 등 여러가지가 있음, header: 제품의 설명서와 같은 역할

                                                                                    // 보내기 전에 해야할 일: JS Object를 json으로 변환(직렬화)
                                                                                    const jsonData = JSON.stringify(requestData);
                                                                                    
                                                                                    // 실제 요청 전송
                                                                                    xhr.send(jsonData);
                                                                                    }, 3000)})
































