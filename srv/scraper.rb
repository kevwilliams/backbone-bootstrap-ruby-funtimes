class Product

	''' 
	Product Factory - The A tags have the details we want contained in child nodes
	Find the children we want by classname and create this object using their values
	''' 
	def initialize(html)
		html.children.each do |child|
			case child.attribute('class').to_s
				when /productName/
					@name = child.text()
				when /productImg/
					@image = child.attribute('src')
					# @image = child.first_element.attribute('src')
					# @image = "image"
				when /brandName/
					@brand = child.text()
				when /productPrice/
					@price = child.first_element_child.text()
			end
		end
	end

	'''
	Output this as a Hash so we can write to/from JSON
	'''
	def to_hash
		{
			'name' => @name,
			'image' => @image,
			'brandName' => @brand,
			'price' => @price
		}
	end

	'''
	Output this as JSON, because we want to make sure we are calling to_hash or weird things happen eg escaped output
	'''
	def to_json
		self.to_hash.to_json
	end

end #:>~

'''
This is the slotmap for the clothes, it holds the items for each slot (Head,Pants etc)
'''

class Wardrobe
	'''
	Add a garment to a slot, this is really just an excuse to use the word Garment
	'''
	def add(slot, garment)
		@rack ||= Hash.new()
		@rack[slot] ||= []
		@rack[slot].push garment.to_hash
	end

	'''
	Debugging only, show the current rack
	'''
	def showRack
		return @rack
	end

	'''
	Saves the Wardrobe as a file for consumption
	'''
	def displayRack
		File.open('data.txt', 'w') { |file| file.write(@rack.to_json) }
	end
end #:>~


'''
Use mechanize to go out and get the product pages
Walk through each A.product element creating Product objects for each
Add them to the Wardrobe and write the JSON file
'''

require "mechanize"

agent = Mechanize.new { |agent| agent.user_agent_alias = "Mac Safari" } # Steve would be proud.
closet = Wardrobe.new() 

'''
This could be extended, what if I want to wear pants, or use a headlamp, or socks on my feet
Theres room for other slots as well, outdoor gear, backpacks and more!
'''

urls = {
	"hats"=> "http://www.zappos.com/hats",
	"belts"=> "http://www.zappos.com/belts~1",
	"shorts"=> "http://www.zappos.com/shorts~1",
	"shirts"=> "http://www.zappos.com/men-shirts-tops~2",
	"wallet"=> "http://www.zappos.com/wallets-accessories-bags~2",
	"shoes"=> "http://www.zappos.com/mens-shoes~ov",
}

urls.each do |slot, url|
	html = agent.get(url).body 
	html_doc = Nokogiri::HTML(html) 

	links = html_doc.css('a.product') # We only want the links cause they are the joociest
	links.each do |link|
		p = Product.new(link) # Create a product for each Link
		closet.add(slot, p)
	end

	closet.displayRack() #Write out the file
end
