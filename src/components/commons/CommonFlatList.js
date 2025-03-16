import React from 'react';
import {FlatList, View} from 'react-native';
import CommonText from "@components/commons/CommonText";

export default function CommonFlatList(props){
    const {data,renderItem} = props;
    return(
        <FlatList
            data={data}
            renderItem={renderItem}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            removeClippedSubviews={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={()=>{
                return <View style={{flex: 1, justifyContent : 'center', alignItems : 'center'}}>
                    <CommonText>
                        No data
                    </CommonText>
                </View>
            }}
            {...props}
        />
    )
}
