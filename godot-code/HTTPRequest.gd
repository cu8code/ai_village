extends HTTPRequest
#
## Called when the node enters the scene tree for the first time.
#func _ready():
	#const header = ["Content-Type: application/json"]
	#const type = {
	  #"sender":"ankan",
	  #"receiver":"sam",
	  #"prompt":"My life is bro",
	  #"about":"billionar"
	#}
	#connect("request_completed",done)
	#request("http://localhost:8080",header,HTTPClient.METHOD_POST,JSON.stringify(type))
#
#func done(result,res_code,headers,body):
	#var text : String = body.get_string_from_utf8()
	#var text_arr: Array = text.split("\n",false)
	#text_arr.remove_at(0)
	#text_arr.remove_at(len(text_arr)-1)
	#var json = " "
	#json = json.join(text_arr)
	#json = JSON.parse_string(json)
#
#
