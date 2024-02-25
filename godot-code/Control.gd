extends Control

@onready var net : HTTPRequest = $HTTPRequest
@onready var textEdit: TextEdit = $TextEdit2
@export var node : Node

func _ready():
	net.connect("request_completed",done)

func done(result,res_code,headers,body):
	print("strating")
	node.request("hi bro")

func _on_button_button_down():
	const header = ["Content-Type: application/json"]
	var type = {
		"mess": textEdit.placeholder_text
	}
	net.request("http://localhost:8080/story",header,HTTPClient.METHOD_POST,JSON.stringify(type))
	$"Button".visible = false
	$"TextEdit2".visible = false
