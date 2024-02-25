extends CharacterBody2D

var is_chatting = false
var room = "jail"
@onready var net: HTTPRequest = $HTTPRequest
@export var target : Node
@export var write : TextEdit
@export var about : String
@export var char_name : String
@export var reply: String

func _ready():
	net.connect("request_completed",done)

func request(promt):
	print("request function triggred")
	const header = ["Content-Type: application/json"]
	var type = {
	  "sender":char_name,
	  "receiver":target.char_name,
	  "prompt":promt,
	  "about":about,
	}
	net.request("http://localhost:8080",header,HTTPClient.METHOD_POST,JSON.stringify(type))

func done(result,res_code,headers,body):
	var text : String = body.get_string_from_utf8()
	var json = JSON.parse_string(text)
	write_to_write(char_name + ":" + json.reply)
	print("triggring next")
	target.request(json.reply)

func write_to_write(text:String):
	write.placeholder_text = write.placeholder_text + "\n" + text + "\n--------------\n"
